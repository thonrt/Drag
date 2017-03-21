import Drag from "./src/drag.js";
import $ from "jquery";

const dragedContainer = $(".draged_holder");
const targetedContainer = $(".container");
console.log("hot");
const drag = new Drag({
    dragedContainer: dragedContainer,
    targetedContainer: targetedContainer
});