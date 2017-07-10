<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

use AppBundle\Entity\Administrativo;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction()
    {
        $url=$_SERVER['QUERY_STRING'];
        return $this->render('default/index.html.twig',array('url' => $url));
    }

    /**
    * @Route("/terminos", name="terminos")
    **/
    public function terminosAction()
    {
    	return $this->render('default/terminos.html.twig');
    }

    /**
    * @Route("/login", name="login")
    **/
    public function loginAction()
    {
        $url=$_SERVER['QUERY_STRING'];
        return $this->render('default/login.html.twig', array('url' => $url));
    }

    /**
    * @Route("/registro", name="registro")
    **/

    public function registroAction(Request $request)
    {
        $url=$_SERVER['QUERY_STRING'];
        $urlSeparada = explode("&", $url);
        $mac = substr($urlSeparada[8], 11, 19);

        $usuario = $request->get('username');
        $contrasena = $request->get('password');
        

        $usuarioLimpio = preg_replace('([^A-Za-z0-9-._])','',$usuario);

        //print_r($usuarioLimpio);exit();

        $_SESSION['contrasena'] = $contrasena;
        $_SESSION['usuario'] =$usuarioLimpio;

        $consulta = $this->activeDirectory($usuarioLimpio,$contrasena);

        if ($consulta != 0)
        {
            $em = $this->getDoctrine()->getManager();
            $administrativos = $em->getRepository('AppBundle:Administrativo')->todos($usuarioLimpio);
            $dispositivos = count($administrativos);

            $_SESSION['dispositivos'] = $dispositivos;

            if ($dispositivos == 0)
            {
                $entity = new Administrativo();
                $entity->setUsuario($usuarioLimpio);
                $entity->setMac($mac);
                $em = $this->getDoctrine()->getManager();
                $em->persist($entity);
                $em->flush();
                $this->get('session')->getFlashBag()->add(
                                'mensaje',
                                'Se ha registrado el dispositivo.'
                            );
                return $this->render('default/show.html.twig', array(
                        'administrativos' => $administrativos,
                        'url' => $url,
                        'contrasena' => $contrasena,
                        'usuario' => $usuarioLimpio,
                        'dispositivos' => $dispositivos,
                    ));
            }

            if ($dispositivos <= 3 && $dispositivos != 0)
            {
                foreach ($administrativos as $administrativo) 
                {
                    $macRegistradas = $administrativo->getMac();     
                    if ($macRegistradas == $mac)
                    {
                        $this->get('session')->getFlashBag()->add(
                                'mensaje',
                                'Dispositivo ya registrado.'
                            );
                    return $this->render('default/show.html.twig', array(
                        'administrativos' => $administrativos,
                        'url' => $url,
                        'contrasena' => $contrasena,
                        'usuario' => $usuarioLimpio,
                        'dispositivos' => $dispositivos,
                    ));
                    }
                }
            
                $entity = new Administrativo();
                $entity->setUsuario($usuarioLimpio);
                $entity->setMac($mac);

                $em = $this->getDoctrine()->getManager();
                $em->persist($entity);
                $em->flush();
                $this->get('session')->getFlashBag()->add(
                                'mensaje',
                                'Se ha registrado otro dispositivo.'
                            );
                 return $this->render('default/show.html.twig', array(
                        'administrativos' => $administrativos,
                        'url' => $url,
                        'contrasena' => $contrasena,
                        'usuario' => $usuarioLimpio,
                        'dispositivos' => $dispositivos,
                    ));
            }

            $this->get('session')->getFlashBag()->add(
                                'mensaje',
                                'Se tiene que eliminar un dispositivo'
                            );
             return $this->render('default/show.html.twig', array(
                        'administrativos' => $administrativos,
                        'url' => $url,
                        'contrasena' => $contrasena,
                        'usuario' => $usuarioLimpio,
                        'dispositivos' => $dispositivos,
                    ));
            
        }
        $this->get('session')->getFlashBag()->add(
                            'mensaje',
                            'Matricula y/o Contraseña incorectas.'
        );

        return $this->render('default/login.html.twig', array(
                        'url' => $url,
                    ));

    }

    private function activeDirectory($usuario,$contrasena)
    {
        $con = @ldap_connect('ldap://148.245.205.50');
        ldap_set_option($con, LDAP_OPT_PROTOCOL_VERSION, 3);
        ldap_set_option($con, LDAP_OPT_REFERRALS, 0);
        $resultado = @ldap_bind($con, $usuario.'@uic.edu.mx', $contrasena);
        return $resultado;
    }


    /**
    * @Route("/eliminar/{id}", name="eliminar")
    **/
    public function eliminarAction($id, Request $request)
    {
        $contrasena = $_SESSION['contrasena'];
        $usuario = $_SESSION['usuario'];
        $url=$_SERVER['QUERY_STRING'];
        $em = $this->getDoctrine()->getManager();
        $dispositivo = $em->getRepository('AppBundle:Administrativo')->find($id);
        
         if (!$dispositivo) {
            throw $this->createNotFoundException(
                'No product found for id '.$id
            );
        }
     
        $em->remove($dispositivo);
        $em->flush();
        $this->get('session')->getFlashBag()->add(
                                'mensaje',
                                'Se ha eliminado el dispositivo exitosamente'
                            );
        $administrativos = $em->getRepository('AppBundle:Estudiante')->todos($usuario);
        $dispositivos = count($administrativos);
        if ($dispositivos == 0)
        {
            return $this->render('default/login.html.twig', array(
                        'url' => $url,
            ));
        }
        return $this->render('default/show.html.twig', array(
                        'administrativos' => $administrativos,
                        'url' => $url,
                        'contrasena' => $contrasena,
                        'usuario' => $usuario,
                        'dispositivos' => $dispositivos,
        ));

    }
}
