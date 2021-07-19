# Invoicify Front

The client uses Angular v4 https://v4.angular.io/docs

An upgraded version will be released soon.


CORS Error Temporary Work Around

In the data.service.ts file change...

```options = new RequestOptions({ withCredentials: false});```
