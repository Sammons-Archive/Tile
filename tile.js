(function ( $ ) {

    $.fn.tile = function(style,speed,callback) {
        var parents  = [];
        this.css(style);
        //find parent containers and their children, remove the children
        for (var i =0; i<this.length; i++) {
            $(this[i]).width(200+Math.random()*200).height(200+Math.random()*200);
            var parent = {};
            parent.node = $(this[i]).parent()[0];
            parent.children = $(parent.node).find(this.selector);
            
            var found = false;

            console.log(parent)
            for (var p in parents) if (parents[p].node == parent.node) found = true;
            if (!found) parents.push(parent);
        }
        for (var p in parents) parents[p].children =
         parents[p].children.sort(function(a,b){return $(a).outerWidth() < $(b).outerWidth()});
        function arrange(container,children,margin) {
            var $cont = $(container);
            var zero = $cont.offset();
            var fattestChildWidth = -5000;
            var smallestChildWidth = 5000;
            var tallestChildHeight = -5000;
            var numberColumns = -1;
            for (var j=0; j < children.length; j++) {
                if ($(children[j]).outerWidth() > fattestChildWidth) {
                    fattestChildWidth = $(children[j]).outerWidth();
                }
                if ($(children[j]).outerWidth() < smallestChildWidth) {
                    smallestChildWidth = $(children[j]).outerWidth();
                }
            }
            var fat = $cont.width()/(fattestChildWidth+2*margin+.2*fattestChildWidth);
            numberColumns = Math.round(fat);
            console.log($cont.width(),fattestChildWidth,numberColumns)
            var columns = [numberColumns];
            columns[-1] = {"right":margin+zero.left};
            for (var i = 0; i < numberColumns; i++) columns[i] = 
                {"height":margin+zero.top,"right":0};
            function getColumn(bool) {//true for max, false for min
                var col = 0;
                if (bool) {
                for (var i = 0; i > numberColumns; i++) 
                    if (columns[i].height > columns[col].height) 
                        col = i;
                } else{
                for (var i = 0; i < numberColumns; i++) 
                    if (columns[i].height < columns[col].height) 
                        col = i;
                }
                return col;
            }
            function dropTile(i,col) {
                var $c = $(children[i]);
                $c.css({"position":"absolute","left":-$c.outerWidth(true),"top":0});
                $c.animate({"left":columns[col-1].right,"top":columns[col].height},speed);
                columns[col].right =columns[col-1].right+$c.outerWidth()+margin;
                columns[col].height += $c.outerHeight()+margin;
            }
            var shortestColumn = 0;
            var rowWidth = margin;
            for (var i=0; i<children.length; i++) {
                var col = getColumn(false);
                dropTile(i,col);
            }
            $cont.height(columns[getColumn(true)].height);
        }
        for (var j =0; j < parents.length; j++) {
            arrange(parents[j].node,parents[j].children,20);
        }

        if (callback) for (var i = 0; i<this.length; i++) callback(this[i]);
        return this;
    };
}( jQuery ));



