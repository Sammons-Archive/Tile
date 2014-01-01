(function ( $ ) {
    $.fn.tile = function(style,speed,callback) {
        var initialPosition = {};
        if (this.length > 0) initialPosition = $(this[0]).position();
        for (var i = 0; i<this.length; i++) {
            var $elem = $(this[i]);
            var position = $elem.offset();
            $elem.css(style);
            $elem.css("position","absolute");
            if (i==0)$elem.offset(initialPosition);
            //here is where work is needed
            else $elem.offset({"left":$(this[i-1]).offset().left
                +$(this[i-1]).outerWidth()
                ,"top":position.top});
            this[i].finalPosition = $elem.offset();

        }
        for (var i = 0; i<this.length; i++) {
            var $elem = $(this[i]);
            $elem.offset({"left":0,"top":0});
            if (!speed) $elem.animate(this[i].finalPosition); 
            else $elem.animate(this[i].finalPosition,speed);
        }
        for (var i = 0; i<this.length; i++) if (callback) callback(this[i]);
        return this;
    };
}( jQuery ));
