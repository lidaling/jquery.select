jquery.select
=============

A jQuery plugin to customize the &lt;select/&gt; element.

Copyright (c) 2010 - 2013 Eduardo García Sanz
Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)

## Browser support
<div style="text-transform: sub; text-align: center;">
<img src="http://media1.juggledesign.com/qtip2/images/browsers/64-chrome.png" title="Chrome 8+" /> 8+ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<img src="http://media1.juggledesign.com/qtip2/images/browsers/64-firefox.png" title="Firefox 3+" /> 3+ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<img src="http://media1.juggledesign.com/qtip2/images/browsers/64-ie.png" title="Internet Explorer 7+" /> 7+ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<img src="http://media1.juggledesign.com/qtip2/images/browsers/64-opera.png" title="Opera 9+" /> 9+ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<img src="http://media1.juggledesign.com/qtip2/images/browsers/64-safari.png" title="Safari 2+, iOS 4+" /> 2+, iOS 4+
</div>

## Usage

Include the css:

```html
<link href="css/jquery.select.css" type="text/css" rel="stylesheet"/>
```

If you need support for MSIE < 10 then:

```html
<!--[if lt IE 10]>
<link rel="stylesheet" type="text/css" href="css/jquery.select.msie9.css">
<![endif]-->
<!--[if lt IE 9]>
<link rel="stylesheet" type="text/css" href="css/jquery.select.msie8.css">
<![endif]-->
<!--[if lt IE 8]>
<link rel="stylesheet" type="text/css" href="css/jquery.select.msie7.css">
<![endif]-->
```

Include the js's:

```html
<script src="js/jquery.js" type="text/javascript"></script>
<script src="js/jquery.select.js" type="text/javascript"></script>
```

## Implementation

There are two ways of implementation, directly applying it to a &lt;select/&gt; element:

```javascript
$(function() {
	$('select').select();
});
```

Or you can "prerender" it by adding some extra HTML code around your selects; this method is better because the select will look good as soon as the page renders because it won't need the javascript for it (avoiding that ugly blink...):

```html
<div class="select">
      <select name="color">
            <option value="#ff0000" selected="selected">Red</option>
            <option value="#00ff00">Green</option>
            <option value="#0000ff">Blue</option>
            <option value="#ffff00">Yellow</option>
            <option value="#ffffff">White</option>
            <option value="#000000">Black</option>
      </select>
      <div class="label">Red</div>
</div>
```

```javascript
$(function() {
	$('.select').select();
});
```

## Options:

Soon...

## Events:

Soon...