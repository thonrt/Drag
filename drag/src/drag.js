/*
@build 2017.3.16
@author Bella Duan
*/
class Drag {
    constructor() {
        this.init(arguments[0]);
    }

    defaultOption() {
        return {
            allowBeyond: false,
            position: {
                mouseStartX: 0,
                mouseStartY: 0,
                mousePreviousX: 0,
                mousePreviousY: 0,
                mouseCurrentX: 0,
                mouseCurrentY: 0,
                mouseOffsetX: 0,
                mouseOffsexY: 0,
                mouseMoveX: 0,
                mouseMoveY: 0
            }

        }
    }

    //=================================================================
    //common
    setOption() {
        this.option = this.getOption(arguments[0]);
        return this;
    }

    getOption() {
        let def_option = this.defaultOption();
        let option = def_option;
        if (arguments.length && arguments[0]) {
            let new_option = arguments[0];
            option = this.merge(def_option, new_option);
        }
        return option;
    }

    isObj(obj) {
        if (!obj || typeof(obj) !== "object" || typeof(obj.constructor) !== "function") {
            return false;
        }
        var isAO = function(o) {
            //remove d3 object
            if (o.attr) {
                return false;
            }
            //does not need toString in Array
            if (o.constructor === Array) {
                return true;
            }
            if (o.constructor === Object && typeof(o.toString) === "function" && o.toString() === "[object Object]") {
                //remove like Math Window ...
                return true;
            }
            return false;
        };

        if (isAO(obj)) {
            return true;
        }

        return false;
    }

    merge() {
            //merge Json
            let args = arguments;
            let len = arguments.length;
            // no parameters
            if (!len) {
                return this;
            }
            //deep merge deep on last parameter
            let deep = true;
            if (args[len - 1] === false) {
                deep = false;
            }
            const copyArray = (item, base) => {
                let len = item.length;
                for (let i = 0; i < len; i++) {
                    var vi = item[i];
                    if (deep && this.isObj(vi)) {
                        base[i] = this.merge(base[i], vi);
                    } else {
                        base[i] = vi;
                    }
                }
            };

            const copyObject = (item, base) => {
                for (let n in item) {
                    if (!item.hasOwnProperty(n)) {
                        continue;
                    }
                    let vn = item[n];
                    if (deep && this.isObj(vn)) {
                        base[n] = this.merge(base[n], vn);
                    } else {
                        base[n] = vn;
                    }
                }
            };

            const copy = (item, base) => {
                //merge to base
                if (item instanceof Array) {
                    copyArray(item, base);
                } else {
                    copyObject(item, base);
                }
            };

            const eachCopy = () => {
                //base merge result
                let base = null;
                for (let i = 0; i < len; i++) {
                    let item = args[i];
                    //only for valid object or array
                    if (!this.isObj(item)) {
                        continue;
                    }
                    //base type depend on first parameter
                    if (base === null) {
                        base = (item instanceof Array) ? [] : {};
                    }
                    copy(item, base);
                }
                return base;
            };

            let baseJson = eachCopy();
            return baseJson;
        }
        //================================================================
    init() {
        this.setOption(arguments[0]);
        let o = this.option;
        this.dragedContainer = o.dragedContainer;
        this.targetedContainer = o.targetedContainer || o.dragedContainer.parent();
        this.start();
    }

    start() {
        const self = this;
        this.dragedContainer.on("dragstart", function(e) {
            self.dragStartHandler(e);
        });
        this.dragedContainer.on("dragend", function(e) {
            self.dragendHandler(e);
        });
        this.targetedContainer.on("dragover", function(e) {
            self.dragoverHandler(e);
        });
        this.targetedContainer.on("dragenter", function(e) {
            //draged element entered targeted element
            return true;
        });
        this.targetedContainer.on("drop", function(e) {
            self.dropHandler(e);
        });
    }

    dragStartHandler(e) {
        let position = this.option.position;
        //record start psition
        position.mouseStartX = e.originalEvent.pageX;
        position.mouseStartY = e.originalEvent.pageY;
        position.mousePreviousX = this.dragedContainer.get(0).offsetLeft;
        position.mousePreviousY = this.dragedContainer.get(0).offsetTop;
        //begin drag
        e.originalEvent.dataTransfer.effectAllowed = "move";
        e.originalEvent.dataTransfer.setData("text", e.target.innerHTML);
        return true;
    }

    dragendHandler(e) {
        e.originalEvent.dataTransfer.clearData("text");
        return false;
    }

    dragoverHandler(e) {
        //draged element move on targted element
        //stop default events
        if (e.preventDefault) {
            e.preventDefault();
        }
        return true;
    }


    dropHandler(e) {
        let position = this.option.position;
        //update position
        position.mouseCurrentX = e.originalEvent.pageX;
        position.mouseCurrentY = e.originalEvent.pageY;
        this.updatePosition(e);
        this.dragedContainer.css({ top: position.mouseOffsetY, left: position.mouseOffsetX });
        return true;
    }

    updatePosition(e) {
        let o = this.option;
        let position = o.position;
        let targetedContainerWidth = this.targetedContainer.width();
        let targetedContainerHeight = this.targetedContainer.height();
        let dragedContainerWidth = this.dragedContainer.width();
        let dragedContainerHeight = this.dragedContainer.height();
        let targetedContainerOffsetLeft = this.targetedContainer.get(0).offsetLeft;
        let targetedContainerOffsetTop = this.targetedContainer.get(0).offsetTop;
        position.mouseOffsetX = e.originalEvent.pageX - position.mouseStartX + position.mousePreviousX;
        position.mouseOffsetY = e.originalEvent.pageY - position.mouseStartY + position.mousePreviousY;
        if (o.allowBeyond) {
            return this;
        }
        // if ((position.mouseCurrentX + position.mouseOffsetX) < targetedContainerOffsetLeft) {
        //     position.mouseOffsetX = position.mouseOffsetX - targetedContainerOffsetLeft;
        //     return this;
        // }
        // if ((position.mouseCurrentX + position.mouseOffsetX) > (targetedContainerOffsetLeft + dragedContainerWidth)) {
        //     position.mouseOffsetX = targetedContainerOffsetLeft + targetedContainerWidth - dragedContainerWidth;
        //     return this;
        // }

    }


};

export default Drag;