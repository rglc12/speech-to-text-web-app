function changeColor(){

    var cssId = 'myCss';
    // var orgId = 'originalStyle';
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    if (!document.getElementById(cssId))
    {
        link.id   = cssId;
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = 'css/cbstyle.css';
        link.media = 'all';
        head.appendChild(link);
        console.log(head.childNodes[1]);

    }

    // else {
    //
    //     head.removeChild(head.childNodes[1]);
    //     link.id   = orgId;
    //     link.rel  = 'stylesheet';
    //     link.type = 'text/css';
    //     link.href = 'css/style.css';
    //     link.media = 'all';
    //     head.appendChild(link);
    //     console.log(head.childNodes[1]);
    //
    // }
}
