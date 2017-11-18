const HOST = location.origin.replace(/^http/, 'ws')
let socket = io.connect(HOST);
let imageQueue = [];
let current = 0;

$(window).on('load',() => {
    //$('img').responsify();
    load();
});

socket.on('newImage' , (data) => {
    imageQueue = imageQueue.concat(data.images);
    console.log('new image' + imageQueue);
    for(i=0; i<data.images.length; i++){
        new Image().src = 'http://www.pclmarketing.com/software/uwu9gen/' + data.images[i];
    }
});

let load = () => {
    if(imageQueue.length > 0) {
        let image = 'http://www.pclmarketing.com/software/uwu9gen/' + imageQueue[current];
        $('#slideshow').css('background-image','url("' + image + '")');
        console.log(current);
        if(current + 1 > imageQueue.length - 1)
            current = 0
        else
            current ++;

        if(imageQueue.length >= 60) {
            location.reload();
        }
    }
};
window.setInterval(() => {
    load();
    console.log('loaded');
}, 10000);