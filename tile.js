$(document).ready(function() {
    /*
    Tile
    */
    (
     function ( $ ) {//begin Tile
         var settings = {
             "speed":500,
             "margin":1
         };
         /*
         function distinct, obtains an array of distinct
         elements' properties from an array, as judged by a getter
         
         given an array of divs, if the getter returns the id of each div
         the resulting array will contain a distinct set of ids
         
         @param ary, is the array of elements to look through
         @param getter, obtains the distinct property
         */
         function distinct(ary, getter) {
             var distinctProperties = [];
             for (var i=0; i < ary.length ; i++) {
                 if (distinctProperties.indexOf(getter(ary[i])) < 0) {
                     distinctProperties.push(getter(ary[i]));
                 }
             }
             return distinctProperties;
         }
         
         /*test distinct, shallow test, check proper length*/
         /*remove this to uncomment code here
         var itemArray = [{"name":"best", "value":1},{"name":"worst", "value":2},{"name":"best","value":3}];
         var distincts = distinct(itemArray,function(obj) {return obj.name;});
         if (distincts.length != 2) console.log("distinct function does not work ",distincts);
         else console.log("distinct function seems to work", distincts);
         
         var distincts = distinct($('.tile'),function(el) {return $(el).parent()[0];});
         //console.log(distincts);
         /*end test distinct*/

        /*function getBound
        in the same spirit of distinct, this function takes an array and a getter
        but this one returns simply the largest or smallest property as determined by an optional comparator
        */
         function getBound(ary,getter,comparator) {
             if (!comparator) {
                 comparator = function(a,b) {return (a>b)};
             }
             var maxOrMin = ary[0];
             for (var i=ary.length-1; i>=0; i--) {
                 if (!comparator(maxOrMin,getter(ary[i]))) maxOrMin = getter(ary[i]);
             }
             
             return maxOrMin;
         }
         /*example of getBound
         
         var testAry = [{"name":"ben", "width":20},{"name":"bob", "width":25},{"name":"james","width":30}];
         var max = getBound(testAry,function(obj) {return obj.width;});
         if (max == 30) console.log("success");
         var max = getBound(testAry,function(obj) {return obj.name;});
         if (max == 'james') console.log("success");
         /*end example*/
         $.fn.tile = function(mar) {
             settings.margin = mar;
             this.css({'position':'absolute','left':-500,"top":0});
             this.children().offset({'left':-500,'top':-500});
             //obtain the individual containers in this call
             var preParents = distinct(this,function(element) {return $(element).parent()[0];});
             
             //prepare parent objects for tiling, intern the dom reference into an object at the least
             //so later any property adding/modifying won't affect the dom directly
             var parents = [];
             for (var i=0; i<preParents.length;i++) {
                 parents.push(
                     {"node":preParents[i]}
                 );
             }
             //this is a static property to maintain that animations are still being performed
             //when tiling is nested, the subsequent tilings can't begin until the parents are finished        
             //actually get to work
             var _selector = this.selector;
             function tiling() {
                 //iterate over each parent and perform the tiling
                 //note this will not begin unless any previous tiling operations have completed
                 for (var i=0; i<parents.length; i++) {                                   
                     var parent = $(parents[i].node);
                     parent.css({});
                     var parentWidth = parent.width();
                     var parentPos = parent.offset();
                     var animSpeed = settings.speed;
                     var margin = settings.margin;
                                
                     var children = parent.find(_selector);
                     //sort children fattest to skinniest
                     children = children.sort(function(a,b) {return ($(b).outerWidth() - $(a).outerWidth());});
                     var widest = getBound(children,function(elem) {return $(elem).outerWidth();});
                 
                     var numColumns = Math.round(parentWidth/(widest+2*margin));
                     var offset =  (parentWidth-numColumns*widest+margin)/2;//meager attempt to center
                     console.log(parentPos);
                     var left = parentPos.left + margin + (parent.outerWidth()-parent.width())/2;
                     var top = parentPos.top + margin + (parent.outerHeight()-parent.height())/2;
                     if (parent.css("position")=="absolute") {
                         left = margin;
                         top = margin;
                     }
                    
                     
                     
                     var columns = [numColumns];
                     for (var j=0; j<numColumns; j++) columns[j] = {"index":j/1,"top":top,"left":left};
                     columns[-1] = {"index":-1,"top":top,"left":left};
                     console.log("done");
                     for (var j=0; j<children.length; j++) {
                         
                         var currentColumn = getBound(columns
                                                      ,function(col) {return col;}
                                                      ,function(a,b) {return (a.top < b.top);});
                         $(children[j]).animate({"left":columns[currentColumn.index-1].left
                                                 ,"top":currentColumn.top},animSpeed);
                         currentColumn.top+=$(children[j]).outerHeight()+margin;
                         currentColumn.left = columns[currentColumn.index-1].left+$(children[j]).outerWidth()+margin;
                     }
                     var tallestColumn = getBound(columns
                                                      ,function(col) {return col;}
                                                      ,function(a,b) {return (a.top > b.top);});
                     if (parent.height() < tallestColumn.top) parent.height(tallestColumn.top - top+margin);
                 
                 }
             };
             
             tiling();
             
         };
     }(jQuery)//end Tile
    )
    
    /*
    Tests
    */
    $('.tile').tile(10);
    setTimeout(function() {
    $('.jazz').tile(5);
    },600);
    setTimeout(function() {           
    $('.monkey').tile(2);
    },1200);

});