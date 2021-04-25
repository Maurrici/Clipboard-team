$( ".element-movable" ).draggable({
    revert: "invalid",
    containment: "document",
    cursorAt: {top: 50, left: 50}
});

// -------------------------------   Areas droppables   --------------------------------------//
let $freeMove = $(".free-move");
let $ordenedMove = $(".ordened-move");

$(".free-move").droppable({
    accept: ".player",
    drop: function( event, ui ) {
        if(ui.helper[0].classList.contains('ordened-element')) transformInFreeMoveElement(event, ui.helper[0]);
    }
});

$(".ordened-move").droppable({
    accept: ".free-element",
    drop: function( event, ui ) {
        if(ui.helper[0].classList.contains('free-element')) transformInOrdenedMoveElement(ui.helper[0]);
    }
});

function transformInFreeMoveElement( event, item ) {
    //Change class of draggable
    item.classList.remove('ordened-element');
    item.classList.add('free-element');

    //Reposition Element Html
    let id = `#${item.id}`;
    let xTotal = event.pageX - $('.free-move').offset().left;
    let yTotal = event.pageY - $('.free-move').offset().top;
    let xElement = event.pageX - $(id).offset().left;
    let yElement = event.pageX - $(id).offset().left;
    console.log(xTotal, xElement);
    item.style.position = "absolute";
    item.style.top = `${yTotal - 50}px`;
    item.style.left = `${xTotal - 25}px`;

    document.querySelector(".free-move").appendChild(item);

    //Set free move for element
    $( id ).draggable( "option", "revert", false );

}

function transformInOrdenedMoveElement(item) {
    //Change class of draggable
    item.classList.remove('free-element');
    item.classList.add('ordened-element');

    //Reposition Element Html
    let id = `#${item.id}`;
    item.style.position = "static";
    item.style.inset = "auto";

    document.querySelector(".ordened-move").appendChild(item);

    //Set free move for element
    $( id ).draggable( "option", "revert", true );
}