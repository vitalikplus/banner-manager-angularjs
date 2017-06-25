         angular.module("rectApp", [])
        .controller("defaultCtrl", function ($scope) {

            $scope.rects = [
                { id: 1, x: 0, y: 0, width: 300, height: 150, color: "FFFF00", style: {
                    background: "#29FF54",
                    height: "150px",
                    width: "300px",
                    left: "0",
                    top: "0"
                    } },
                { id: 2, x: 200, y: 300, width: 300, height: 150, color: "FFFF00", style: {
                    background: "#55FF00",
                    height: "150px",
                    width: "300px",
                    left: "200px",
                    top: "300px"                                        
                    } }, 
                { id: 3, x: 300, y: 400, width: 300, height: 150, color: "FFFF00", style: {
                    background: "#FF9900",
                    height: "150px",
                    width: "300px",
                    left: "300px",
                    top: "400px"                                        
                    } }
            ];

            $scope.rectSelected = {};
            $scope.rectAddDisabled = false;             
            $scope.rectDeleteDisabled = true;             
            $scope.inputReadonly = true;             

            $scope.addRect = function () {
                    let rectContainer = document.querySelector('.rectContainer');
                    let style = window.getComputedStyle(rectContainer);
                    let top = style.getPropertyValue('height');
                    let left = style.getPropertyValue('width');
                    let rect = {
                        id: new Date().getTime(),
                        x: parseInt(left)/2 - 150,
                        y: parseInt(top)/2 - 75,
                        width: 300,
                        height: 150,
                        color: "FFFF00"
                    }

                    rect.style = {
                        background: '#' + rect.color,
                        height: rect.height + "px",
                        width: rect.width + "px"
                    }

                    $scope.rects.push(rect);
                    if ($scope.rects.length >= 10) $scope.rectAddDisabled = true; 
            }

            $scope.deleteRect = function () {
                if (!$scope.rectSelected.id) return;
                let index = $scope.rects.findIndex( (elem) => elem.id==$scope.rectSelected.id)
                $scope.rects.splice(index,1);
                $scope.rectSelected = {};
                $scope.rectDeleteDisabled = true;
                $scope.inputReadonly = true;
                if ($scope.rects.length < 10) $scope.rectAddDisabled = false;                
            }

            $scope.selectRect = function(rect, event) {
                const obj = $scope.rectSelected; 
                let id; //clicked react id
                if (event) id = event.target.id;
                let element = document.getElementById(id);
                if (!$scope.rectSelected.id) {
                    element.classList.add("active") //case none rect is selected
                    element.addEventListener("mousedown", mouseDownHandler);
                    element.addEventListener("mousemove", mouseMoveHandler);
                    }
                    else if ($scope.rectSelected.id == rect.id) { //case the clicked rect is selected
                        element.classList.toggle("active");
                        for (const prop of Object.keys(obj)) { //emptying the rectSelected object
                            delete obj[prop];
                        }
                        $scope.rectDeleteDisabled = true;
                        $scope.inputReadonly = true;
                        element.removeEventListener("mousedown", mouseDownHandler);
                        element.removeEventListener("mousemove", mouseMoveHandler);
                        return;
                    } else { //case clicked rect <> selected rect
                        element.classList.add("active");
                        element.addEventListener("mousedown", mouseDownHandler);
                        element.addEventListener("mousemove", mouseMoveHandler);
                        document.getElementById($scope.rectSelected.id).classList.remove("active");
                    }
                $scope.rectSelected.id = rect.id;
                $scope.rectSelected.x = rect.x;
                $scope.rectSelected.y = rect.y;
                $scope.rectSelected.width = rect.width;
                $scope.rectSelected.height = rect.height;
                $scope.rectSelected.color = rect.color;
                $scope.rectDeleteDisabled = false;
                $scope.inputReadonly = false;
            }

            $scope.changeInput = function(elem) {
                if (!$scope.rectSelected.id) return;
                let index = $scope.rects.findIndex( (elem) => elem.id==$scope.rectSelected.id)
                switch (elem){
                    case "x": 
                        let x = $scope.rectSelected.x;
                        $scope.rects[index].x = x;
                        $scope.rects[index].style.left = x + "px"
                        break;
                    case "y": 
                        let y = $scope.rectSelected.y;
                        $scope.rects[index].y = y;
                        $scope.rects[index].style.top = y + "px"
                        break;
                    case "width": 
                        let width = $scope.rectSelected.width;
                        $scope.rects[index].width = width;
                        $scope.rects[index].style.width = width + "px"
                        break;                        
                    case "height": 
                        let height = $scope.rectSelected.height;
                        $scope.rects[index].height = height;
                        $scope.rects[index].style.height = height + "px"
                        break;
                    case "color": 
                        $scope.rects[index].color = $scope.rectSelected.color;
                        $scope.rects[index].style.background = '#' + $scope.rects[index].color;
                }
            }

//-------------------- Drag and Drop 
            
            function mouseDownHandler(e) {
                let container = document.querySelector('.container');
                let containerXY = getCoords(container);
                let ball = e.target;
                let coords = getCoords(ball);
                let shiftX = e.pageX - coords.left;
                let shiftY = e.pageY - coords.top;

                moveAt(e);

                function moveAt(e) {
                    let x = e.pageX - containerXY.left - shiftX;
                    let y = e.pageY - containerXY.top - shiftY;
                    ball.style.left = x + 'px';
                    ball.style.top = y + 'px';
                    $scope.rectSelected.x = x;
                    $scope.rectSelected.y = y;
                    let index = $scope.rects.findIndex( (elem) => elem.id==$scope.rectSelected.id)
                    $scope.rects[index].x = x;
                    $scope.rects[index].style.left = x + "px"                    
                    $scope.rects[index].y = y;
                    $scope.rects[index].style.top = y + "px"                    
                }

                document.onmousemove = function(e) {
                    moveAt(e);
                };

                ball.onmouseup = function() {
                    document.onmousemove = null;
                    ball.onmouseup = null;
                };

                ball.ondragstart = function() {
                    return false;
                };

            }

//Resize experiments
            function mouseMoveHandler(e) {
                // let container = document.querySelector('.container');
                // let containerXY = getCoords(container);
                // let ball = e.target;
                // let coords = getCoords(ball);
                // let box = ball.getBoundingClientRect;
                // let shiftX = e.pageX - coords.left;
                // let shiftY = e.pageY - coords.top;                
                // if (shiftX<10 || shiftX>140) {
                //     console.log("shiftX ,shiftX", shiftX, shiftY );
                //     console.log('can change the width')
                //     element.classList.add("resize") //case none rect is selected
                    
                // }
            }

            function getCoords(elem) {
                // (1)
                var box = elem.getBoundingClientRect();
                
                var body = document.body;
                var docEl = document.documentElement;
                
                // (2)
                var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
                var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
                
                // (3)
                var clientTop = docEl.clientTop || body.clientTop || 0;
                var clientLeft = docEl.clientLeft || body.clientLeft || 0;
                
                // (4)
                var top  = box.top +  scrollTop - clientTop;
                var left = box.left + scrollLeft - clientLeft;
                
                // (5)
                return { top: Math.round(top), left: Math.round(left) };
            }

        });
    