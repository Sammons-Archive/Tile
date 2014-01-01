Tile
====

jquery plugin to have a neat customizable effect on page load for tiles

Usage
---

* $('.tile').tile()
	* basic usage, will not enforce any style and will effect animations at 200 ms

* $('.tile').tile(style)
	* animations will happen over 200ms and the style will be enforced
	note that any css position styles will be overruled
	* pass the style as an object : {"background-color":"blue", "width":200}

* $('.tile').tile(style, speed)
	* animations will happen in the number of milliseconds denoted by speed

* $('.tile').tile(style, speed, callback)
	* the callback will be performed on each element contained in the jquery object