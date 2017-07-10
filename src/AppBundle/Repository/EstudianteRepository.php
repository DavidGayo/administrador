<?php

namespace AppBundle\Repository;

use Doctrine\ORM\EntityRepository;

/**
 * EstudianteRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class EstudianteRepository extends EntityRepository
{
	public function todos($estudiante)
	{
		return $this->getEntityManager()->createQuery('SELECT e FROM AppBundle:Estudiante e WHERE e.usuario = :usuario')->setParameter('usuario',$estudiante)->getResult();
	}
}
