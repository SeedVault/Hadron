#!/bin/bash
# command-i to run in Atom on MacOS
# To fix visual glitch
# sequoia.css line 12 ~  /* padding: 13px 0 0 0px; */
#                        /* height: 45px !important; */

#unzip -d . dist_3d.zip ; rm -rf  /var/www/html/hadron/dist_3d/ ; mv dist_3d/ /var/www/html/hadron/dist_3d/

#unzip -d . Archive.zip
#rm -rf  /var/www/html/hadron/beta_author;rm -rf  /var/www/html/hadron/dev_author;rm -rf  /var/www/html/hadron/prod_author
#mv beta_author/ /var/www/html/hadron/beta_author/; mv dev_author/ /var/www/html/hadron/dev_author/; mv prod_author/ /var/www/html/hadron/prod_author/

#cd /home/botanic/hadrons
#mv ../dist_3d.zip .
#unzip -d . dist_3d.zip
#rm -rf  /var/www/html/hadron/dist_3d/ ; mv dist_3d/ /var/www/html/hadron/dist_3d/

cd ~/Development/Work\ Repos/SEED/Hadron/;npx webpack
