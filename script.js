(function(){

    var STARTPOS = [0,0];
    var MOVE_MAP = {
        '<' : [0, -1],
        '>' : [0,  1],
        '^' : [1, -1],
        'v' : [1,  1]
    };

    var loadData = function loadData() {
        var request = new XMLHttpRequest();
        request.open('GET', 'input.txt', true);

        request.addEventListener('load', function() {
            if (request.status >= 200 && request.status < 400) {
                var data = request.responseText;
                var parsed = parseData(data);
                displayResults(parsed);
            } else {
                throw new Error('Error response from server');
            }
        });

        request.addEventListener('error', function(e) {
            throw new Error('Request failed');
        });

        request.send();
    };

    var parseData = function parseData(data) {

        //Perf test : the below took ~450 ms
        var result = {
            pos : [STARTPOS[0], STARTPOS[1]],
            billboards : [],
            coords : {},
            path : [STARTPOS],
            bounds : {
                lower : [0,0],
                upper : [0,0]
            }
        };
        for (var i = data.length - 1; i >= 0; i--) {
            var action = data[i];

            switch(action) {
                case '<' :
                case '>' :
                case 'v' :
                case '^' :
                    result.pos[MOVE_MAP[action][0]] += MOVE_MAP[action][1];
                    result.path.push([result.pos[0], result.pos[1]]);
                    result.bounds.upper[MOVE_MAP[action][0]] = result.pos[MOVE_MAP[action][0]] > result.bounds.upper[MOVE_MAP[action][0]] ? result.pos[MOVE_MAP[action][0]] : result.bounds.upper[MOVE_MAP[action][0]];
                    result.bounds.lower[MOVE_MAP[action][0]] = result.pos[MOVE_MAP[action][0]] < result.bounds.lower[MOVE_MAP[action][0]] ? result.pos[MOVE_MAP[action][0]] : result.bounds.lower[MOVE_MAP[action][0]];
                break;
                case 'x' :
                    result.coords[result.pos[0]] = result.coords[result.pos[0]] || {};
                    result.coords[result.pos[0]][result.pos[1]] = typeof result.coords[result.pos[0]][result.pos[1]] === 'number' ?  result.coords[result.pos[0]][result.pos[1]] : result.billboards.length;
                    result.billboards[result.coords[result.pos[0]][result.pos[1]]] = result.billboards[result.coords[result.pos[0]][result.pos[1]]] || 0;
                    result.billboards[result.coords[result.pos[0]][result.pos[1]]] += 1;
                    result.path.push('photo');
                break;

                default:
                    throw new SyntaxError('Unexpected input');

            }
        }

        return result;

    };

    var displayResults = function displayResults(data) {
        var $total = document.querySelector('[data-total]');
        var $endpos = document.querySelector('[data-endpos]');

        var xrange = data.bounds.upper[0] - data.bounds.lower[0];
        var yrange = data.bounds.upper[1] - data.bounds.lower[1];

        var width = 1280
        var height = 1280 / (xrange / yrange);


        var canvas = document.getElementById('canvas');
        canvas.width = width;
        canvas.height = height;

        var ctx = canvas.getContext('2d');
        ctx.width = width;
        ctx.height = height;



        var pos = STARTPOS;

        var startx = 10 + (STARTPOS[0] - data.bounds.lower[0]) / (xrange) * (ctx.width - 20);
        var starty = 10 + (STARTPOS[1] - data.bounds.lower[1]) / (yrange) * (ctx.height - 20);

        var endx = 10 + (data.pos[0] - data.bounds.lower[0]) / (xrange) * (ctx.width - 20);
        var endy = 10 + (data.pos[1] - data.bounds.lower[1]) / (yrange) * (ctx.height - 20);


        var i = 0;

        var lpf = 5;
        var ln = 0;
        var incrementalCount = {};

        var render = function() {
            var point = data.path[i];

            var x = 10 + (point[0] - data.bounds.lower[0]) / (xrange) * (ctx.width - 20);
            var y = 10 + (point[1] - data.bounds.lower[1]) / (yrange) * (ctx.height - 20);

            

            if(point === 'photo') {
                point = pos;
                var photoCount = data.billboards[data.coords[point[0]][point[1]]];

                $total.textContent = data.coords[point[0]][point[1]] + 1;
                
                x = 10 + (point[0] - data.bounds.lower[0]) / (xrange) * (ctx.width - 20);
                y = 10 + (point[1] - data.bounds.lower[1]) / (yrange) * (ctx.height - 20);
                
                ctx.beginPath();
                incrementalCount[point[0]] = incrementalCount[point[0]] || {};
                incrementalCount[point[0]][point[1]] = incrementalCount[point[0]][point[1]] || 0;
                incrementalCount[point[0]][point[1]] += 1;

                ctx.arc(x, y, incrementalCount[point[0]][point[1]], 0, Math.PI * 2, false);
                ctx.fillStyle = 'rgba(49, 151, 255, 0.3)';
                ctx.fill();
                ctx.closePath();
            } else {
                ctx.beginPath();
                ctx.moveTo(10 + (pos[0] - data.bounds.lower[0]) / (xrange) * (ctx.width - 20), 10 + (pos[1] - data.bounds.lower[1]) / (yrange) * (ctx.height - 20));
                ctx.lineTo(x,y);
                ctx.strokeStyle = 'rgba(50, 50, 50, 0.1)';
                ctx.stroke();
                ctx.closePath();

                pos = point;
            }

            $endpos.textContent = point[0] + ', ' + point[1];

            // Always draw start point on top


            ctx.beginPath();
            ctx.arc(startx, starty, 5, 0, Math.PI * 2, false);
            ctx.fillStyle =  'rgba(255, 60, 88, 1)';
            ctx.fill();

            // Always draw end point on top

            ctx.beginPath();
            ctx.arc(endx, endy, 5, 0, Math.PI * 2, false);
            ctx.fillStyle =  'rgba(63, 188, 88, 1)';
            ctx.fill();
            i++;

            if(i < data.path.length) {
                if(ln < lpf) {
                    ln ++;
                    render();
                } else {
                    ln = 0;
                    requestAnimationFrame(render);
                }
            }
        }

        render();

    };


    loadData();


})();