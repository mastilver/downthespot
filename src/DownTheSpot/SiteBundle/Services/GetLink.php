<?php
	
	namespace DownTheSpot\SiteBundle\Services;
	
	class GetLink
	{
		//TODO: gérer la connection à la base de donnée
		
		private $tracksInfo;
		
		private $downloadLinks;
		
		private $musicLinkProviderInfos;
		
		
		function __construct()
		{
			$this->downloadLinks = array();
			
			$this->musicLinkProviderInfos = array
			(
				array
				(
					'beforeLink' => '<a class="link" onclick="return prepare_download_file(this);" href="',
					'afterLink' => '" target="_blank"',
					
					'generateUrl' => function($trackInfo)
					{
						$searchString = '';
					
						foreach($trackInfo->artists as $artist)
						{
							$searchString .= implode('-', explode(' ', $artist));
						}
						
						$searchString .= '-' . implode('-', explode(' ', $trackInfo->name));
						
						return 'http://www.mp3olimp.net/' . $searchString;
						
						
					}//generateUrl()
				)
			);
			
			
			
		}
		
		
		
		public function getLink($tracksInfo)
		{
			//initialization of arrays
			$this->tracksInfo = $tracksInfo;
			
			$this->clean();
			
			
			//initialization of all the downloadLinks
			for($i = 0, $c = count($this->tracksInfo); $i < $c; $i++)
			{
				$this->downloadLinks[$i] = '';
			}
			
			
			$this->database();
			
			if(!$this->isFull())
			{
				$this->musicLinkProvider();
			}
			
			return array('tracksInfo' => $this->tracksInfo, 'downloadLinks' => $this->downloadLinks);
		}
		
		private function isFull()
		{
			for($i = 0, $c = count($this->tracksInfo); $i < $c; $i++)
			{
				if(empty($this->downloadLinks[$i]))
				{
					return false;
				}
			}
			
			return true;
		}
		
		private function clean()
		{
			for($i = 0, $c = count($this->tracksInfo); $i < $c; $i++)
			{
				if(empty($this->tracksInfo[$i]) || empty($this->tracksInfo[$i]->name) || empty($this->tracksInfo[$i]->artists))
				{
					unset($this->tracksInfo[$i]);
				}
				else
				{
					//     first the track name     //
					
					//put to lower case
					$this->tracksInfo[$i]->name = strtolower($this->tracksInfo[$i]->name);
					
					//remove everything between () and [] and after -
					$this->tracksInfo[$i]->name = preg_replace('#\(.*\)|\[.*\]|-.*#', '', $this->tracksInfo[$i]->name);
					
					//remove extra spaces
					$this->tracksInfo[$i]->name = trim($this->tracksInfo[$i]->name);
					
					
					//     then artists     //
					
					//remove multiple
					$this->tracksInfo[$i]->artists = array_unique($this->tracksInfo[$i]->artists);
					
					//put to lower case
					for($j = 0, $d = count($this->tracksInfo[$i]->artists); $j < $d; $j++)
					{
						$this->tracksInfo[$i]->artists[$j] = strtolower($this->tracksInfo[$i]->artists[$j]);
					}
					
					
				}
			}
			array_chunk($this->tracksInfo, count($this->tracksInfo));
			
		}//clean()
		
		private function refreshDatabase()
		{
			//array_diff() //pour faire la conpparaison entre le tableau final et celui qui est sortie de la base de donnée
		}//refreshDatavbase()
		
		
		
		////////////////////////////////////////////////////////////////
		
		private function database()
		{
			
			
			//return an array witch contains track numbers that aren't in the database
		}
		
		private function musicLinkProvider()
		{
			ini_set('user_agent','Mozilla/5.0');
			
			foreach($this->musicLinkProviderInfos as &$musicLinkProviderInfo)
			{
				foreach($this->tracksInfo as $trackNumber => &$trackInfo)
				{
					$downloadLink = &$this->downloadLinks[$trackNumber];
					
					
					//if we already have a link for this file, we don't need to get the download link anymore
					if(empty($downloadLink))
					{
						$url = $musicLinkProviderInfo['generateUrl']($trackInfo);
						
						$pageContent = file_get_contents($url);
						
						$startPosition = strpos($pageContent, $musicLinkProviderInfo['beforeLink']);
						$endPosition = strpos($pageContent, $musicLinkProviderInfo['afterLink']);
						
						if($startPosition && $endPosition)
						{
							$offset = strlen($musicLinkProviderInfo['beforeLink']);
							
							$downloadLink = substr($pageContent, $startPosition + $offset, $endPosition - $startPosition - $offset);
						}
					}//if() downloadLinks is empty
				}//foreach() tracks
				
				
				if($this->isFull())
				{
					break;
				}
			}//foreach() services
		}//musicLinkProvider()
		
	}
