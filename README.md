DownTheSpot
========================

DownTheSpot is still in development.
To access the homepage on your php server: http://localhost/downthespot/web/app_dev.php


-- Add a music link prodider (website where you can find easily download link for tracks) --
- open: /var/www/downthespot/src/DownTheSpot/SiteBundle/Services/GetLink.php
- find this line (about line 20): $this->musicLinkProviderInfos = array
- add a new array in the array: [musicLinkProviderInfos] whitch content:
	- 'beforeLink': the html content before the first download link
	- 'afterdLink': the html content after the first download link
	- generateUrl: a function which return the url of the website depends on track name and artists name.
