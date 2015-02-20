#!/bin/bash

uglifycss unbxdAutosuggest.css > jquery-unbxdautosuggest.min.css && gzip jquery-unbxdautosuggest.min.css && aws s3 cp jquery-unbxdautosuggest.min.css.gz s3://unbxd/jquery-unbxdautosuggest.css --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers --content-encoding gzip --cache-control max-age=3600;


uglifyjs unbxdAutosuggest.js -o jquery-unbxdautosuggest.min.js && gzip -c jquery-unbxdautosuggest.min.js > jquery-unbxdautosuggest.min.js.gz && aws s3 cp jquery-unbxdautosuggest.min.js.gz s3://unbxd/jquery-unbxdautosuggest.js --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers --content-encoding gzip --cache-control max-age=3600;


