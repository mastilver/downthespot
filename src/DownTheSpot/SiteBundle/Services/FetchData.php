<?php
	
	namespace DownTheSpot\SiteBunlde\Services;
	
	class FetchData
	{
		
		public function checkForm()
		{
			
		}
		
		public function fetch()
		{
			switch($_POST['type'])
			{
				case 'raw':
					$this->raw();
					break;
				
				case 'spotify':
					$this->spotify();
					break;
				
				default:
					return array();
			}
		}
		
		private function raw()
		{
			
		}
		
		private function spotify()
		{
			
		}
	}
