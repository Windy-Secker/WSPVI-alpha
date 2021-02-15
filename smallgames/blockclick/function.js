    var clock = null; //定时器操作句柄
    var state = 0; //0初始化，1进行中，2暂停，3失败
    var speed = 2;
	var case0 = '加油哦！'
	var case1 = '你太厉害了！';
	var case2 = '你快超神了！';
	var case3 = '您失败了，请重新开始游戏！';
	var case4 = 'game over!';
/*
创建div,className是其类名
*/
    function cdiv(className)
    {
        var div = document.createElement('div');
        div.className = className;
        return div;
    }
/*
创建div.row
*/
    function crow()
    {
        var row = cdiv('row');
        var classes = createSn();
        var con = $('container');
        
        for(var i=0;i<4;i++)
        {
            row.appendChild(cdiv(classes[i]));
        }
        
        if(con.firstChild == null)
        {
            con.appendChild(row); //刚开始添加一行
        }
        else
        {
            con.insertBefore(row,con.firstChild);//以后从上往下添加行
        }
    }
/*
按id获取对象
*/
    function $(id)
    {
        return document.getElementById(id)
    }
/*
返回一个数组，随机其中1个单元值为‘cell black’，其他3个为cell
*/
    function createSn()
    {
        var arr = ['cell','cell','cell','cell'];
        var i = Math.floor(Math.random()*4);
        arr[i] = 'cell black';
        return arr;
    }
/*
初始化，自动添加row
*/
    function init()
    {
        for(var i =0; i<4;i++)
        {    
            crow();    
        }
        //委托事件--点击
        $('main').onclick = function (ev)
        {
            judge(ev);
        }
    }
    
    function judge(ev)//判断输赢，加分
    {
        if(state == 3)
        {    document.getElementById('remind').innerHTML=case3;
            return;
        }
        if(ev.target.className.indexOf('black') == -1)
        {
            fail();
        }
        else
        {
            ev.target.className = 'cell';
            ev.target.parentNode.pass = 1;
            score();    
        }
    }
/*
动画
*/
    function move()
    {
        var con = $('container');
        var top = parseInt(window.getComputedStyle(con,null)['top']);
        if(speed + top > 0)
        {    top = 0;} //top走过头，直接top=0
        else
        {    
            top += speed; //调节每次下降的像素
        }
        con.style.top = top + 'px';
        
        if(top == 0)
        {    
            crow();
            con.style.top = '-100px';
            drow();
        }
        else if(top == (-100 + speed))
        {
            var rows = con.childNodes;
            if((rows.length == 5) && (rows[rows.length-1].pass !== 1))
            {
                fail();
            }    
        }
    }
/*
失败，结束
*/
    function fail()
    {
        clearInterval(clock);
        state = 3;
        document.getElementById('remind').innerHTML=case4;    
    }
/*
start() 启动
*/
    function start()
    {
        clock = window.setInterval('move()',30);    
    }
/*
删除最后一行
*/
    function drow()
    {
        var con = $('container');
        if(con.childNodes.length == 6)
        {
            con.removeChild(con.lastChild);
        }
    }    
/*
计分
*/    
    function score()
    {
        var newscore = parseInt($('score').innerHTML)+1;
        $('score').innerHTML = newscore;
        if(newscore % 10 == 0)
        {
            jiasu();
        }    
    }
/*
加速函数
*/    
    function jiasu()
    {
        speed += 2;
        if(speed == 6)
        {    document.getElementById('remind').innerHTML=case0;}
        else if(speed == 10)
        {    document.getElementById('remind').innerHTML=case1;}
        else if(speed == 20)
        {    document.getElementById('remind').innerHTML=case2;}
    }
    
    
    init();
    start();

	function refresh()
	{
		window.location.reload()
	}