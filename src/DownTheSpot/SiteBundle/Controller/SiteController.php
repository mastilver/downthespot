<?php

	namespace DownTheSpot\SiteBundle\Controller;
	
	use Symfony\Bundle\FrameworkBundle\Controller\Controller;
	use Symfony\Component\HttpFoundation\Response;
	
		
	class SiteController extends Controller
	{
	    public function indexAction()
	    {
	        return $this->render('DownTheSpotSiteBundle:Site:homepage.html.twig');
	    }
	    
	    public function downloadAction()
	    {
			if(true or $this->getRequest()->isXmlHttpRequest())
			{
				$getLink = $this->container->get('down_the_spot_site.getlink');
				
				/*$downloadLinks = $getLink->getLink(array(array('track' => 'catgroove', 'artists' => array('parov stellar')), 
														 array('track' => 'catgroove', 'artists' => array('parov stelar'))));*/
				
				$tracksInfo = json_decode($this->getRequest()->request->get('tracksInfo'));
				
				//print_r($this->getRequest()->request->get('tracksInfo'));
				
				//print_r($tracksInfo);
				
				$return = $getLink->getLink($tracksInfo);
				
				
				//$return = ['rhgrh', 'fbdbd', 'fvfdvf'];
				
				
				
				
				return new Response(json_encode($return),200,array('Content-Type'=>'application/json'));
				//return new Response($this->getRequest()->request->get('tracksInfo'), 200, array('Content-Type'=>'application/json'));
			}
			else
			{
				throw $this->createNotFoundException('Page inaccessible de cette manière');
			}
		}
	}
