var Configuracao = {
    velocidade: 25, //pixel por segundos
    tempoEstrelaAtiva: 5000, //Em milisegundos
    largura: 15
}//Fecha var Configuracao

var contexto; /*Variavel que permite a criação de formas vetoriais dentro do Canvas*/

var Canvas = {
    _init: function(){
        //definir o canvas
        var objCanvas = document.getElementById('canvas');
        contexto = objCanvas.getContext("2d");
        
        Canvas.maxWidth = parseInt(objCanvas.width);
        Canvas.maxHeight = parseInt(objCanvas.height);
        Canvas._bg();
        
    }, //fecha init
    _bg: function(){
        //limpa area do canvas
        contexto.clearRect(0,0,Canvas.maxWidth,Canvas.maxHeight);
        //criar um retangulo com degrade
        contexto.beginPath();
        //declara o grandiente e escolhe ponto de inicio e fim das cores do gradiente
        /*var gradient = contexto.createLinearGradient(Canvas.maxWidth,0,0,Canvas.maxHeight);
        //definir cores de gradiencia
        gradient.addColorStop(0,"#ff5");
        gradient.addColorStop(1,"#f60");
        contexto.fillStyle = gradient;
        contexto.fillRect(0,0,Canvas.maxWidth,Canvas.maxHeight);*/
        contexto.drawImage (document.getElementById ("imagem"), 0, 0, Canvas.maxWidth, Canvas.maxHeight);
        contexto.closePath();
    },// fecha bg
    
    _preencher: function(){
        Canvas._bg();
        for(i=0;i<Snake.tamanho;i++){
            contexto.fillStyle = "#000"; //cor da snake
            contexto.beginPath();//começa a desenhar
            contexto.drawImage(document.getElementById ("cobra"),Snake.corpo[i].x * Configuracao.largura,
            Snake.corpo[i].y * Configuracao.largura,Configuracao.largura,Configuracao.largura);
            contexto.closePath() //finaliza o desenho
        }//fecha for
        Snake._mover();
        Jogo.tempo += Configuracao.velocidade;
        if(Jogo.tempo % (Configuracao.velocidade * 50)==0){
            Estrelas._adicionar();
        }//fecha if
        Estrelas._preencher();
        Estrelas._capturar();     
        
    } //Fecha preencher
}//Fecha o Canvas

var Estrelas = {
    lista: new Array(),
    
    _adicionar: function(){
        var lugar_ocupado = true;
        var estrela_x, estrela_y;
        
        while(lugar_ocupado==true){
            lugar_ocupado=false;
            estrela_x = parseInt(Math.random()*(Canvas.maxWidth/Configuracao.largura));
            estrela_y = parseInt(Math.random()*(Canvas.maxHeight/Configuracao.largura));
            for(i=0;i<Snake.tamanho;i++){
                //se o corpo da snake estiver no mesmo lugar q uma estrela, 
                //o lugar ocupado e não podera ser preenchido com outra estrela.
                if(Snake.corpo[i].x==estrela_x && Snake.corpo[i].y==estrela_y){
                    lugar_ocupado=true;
                }//fecha o if
            }//fecha o for
        }//fecha o while
        Estrelas.lista.push({
            x: estrela_x,
            y: estrela_y,
            inicio: Jogo.tempo
        });
    }, //fecha adicionar
    _preencher: function(){
        for(i=0;i<Estrelas.lista.length;i++){
            //contexto.fillStyle = "#1d9f53"; //cor da estrela
            contexto.beginPath(); //desenhando estrela
            contexto.drawImage(document.getElementById ("estrela"), Estrelas.lista[i].x * Configuracao.largura,
                              Estrelas.lista[i].y * Configuracao.largura,
                              Configuracao.largura,Configuracao.largura); //tamanho da estrela
            contexto.closePath();//finaliza o desenho
        }//fechar o for
        //Verificacao do tempo da estrela na tela, se ela estiver em tela no inicio, começa a contagem das demais estrelas
        if(Estrelas.lista.length>0){
            if(Estrelas.lista[0].inicio + Configuracao.tempoEstrelaAtiva < Jogo.tempo){
                Estrelas.lista.shift();
            }//fecha o if
        }//fecha o if
    }, //fecha preencher
    _capturar: function(){
        for(i=0;i<Estrelas.lista.length;i++){
            if(Estrelas.lista[i].x==Snake.corpo[Snake.tamanho-1].x && Estrelas.lista[i].y==Snake.corpo[Snake.tamanho-1].y){
                Snake._crescer();//cada estrela engolida faz com que a Snake fique maior
                Jogo.pontos+=500;//cada estrela vale 500 pontos
                return Estrelas._remover(i);
            }//fecha o if
        }//fecha o for
    }, //fecha capturar
    _remover: function(Indice){
        for(i=Indice;i + 1 <Estrelas.lista.length;i++){
            Estrelas.lista[i].x = Estrelas.lista[i+1].x;
            Estrelas.lista[i].y = Estrelas.lista[i+1].y;
        }//fecha o for      
        Estrelas.lista.pop();//Removendo a estrela de acordo com as coordenadas dadas acima
    } //fecha remover
}//fecha var Estrelas

var Snake = {
    tamanho:0,
    direcao:0,
    ultimaDirecao:0,
    corpo: new Array(),
    
    _mover: function(){
        Jogo._placar();
        
        var novo_x = Snake.corpo[Snake.tamanho-1].x;
        var novo_y = Snake.corpo[Snake.tamanho-1].y;
        if(Snake.direcao == 0) novo_y--;//para cima
        if(Snake.direcao == 1) novo_x++;//para esquerda
        if(Snake.direcao == 2) novo_y++;//para baixo
        if(Snake.direcao == 3) novo_x--;//para direita
        Snake.ultimaDirecao = Snake.direcao;//quando a snake parar informa a ultima direcao
        
        
       
        //Verificar se a snake bateu em si mesma
        for(i=0;i<Snake.tamanho-1;i++){
            Snake.corpo[i].x = Snake.corpo[i+1].x;
            Snake.corpo[i].y = Snake.corpo[i+1].y;
            if(Snake.corpo[i].x == novo_x && Snake.corpo[i].y == novo_y){
                return Jogo._gameOver();
            }//fecha o if
        }//fecha o for
        
        Snake.corpo[Snake.tamanho-1].x = novo_x;
        Snake.corpo[Snake.tamanho-1].y = novo_y;
        
        //verifica se a snake bateu na parede
        //Se a snake bater do lado esquerdo ou direito, gameOver
        if(Snake.corpo[Snake.tamanho-1].x * Configuracao.largura >= Canvas.maxWidth || Snake.corpo[Snake.tamanho-1].x < 0){
            return Jogo._gameOver();
        }//fecha o if
        //Se a snake bater emcima ou embaixo, gameOver
        if(Snake.corpo[Snake.tamanho-1].y * Configuracao.largura >= Canvas.maxHeight || Snake.corpo[Snake.tamanho-1].y < 0){
            return Jogo._gameOver();
        }//fecha o if
    },//fecha mover
    _crescer: function(){
        //funcao unshift faz com que o valor agregado de cada estrela seja inserido no array que representa o corpo da snake
        Snake.corpo.unshift({
            x:Snake.corpo[0].x-1,
            y:Snake.corpo[0].y
        },{
            x:Snake.corpo[0].x-1,
            y:Snake.corpo[0].y
        },{
            x:Snake.corpo[0].x-1,
            y:Snake.corpo[0].y
        });
        Snake.tamanho+=3;
    } //fecha crescer
}//fecha var snake


var Jogo = {
    play:'',
    pontos:0,
    tempo:0,
    _iniciar: function(){
        Snake.tamanho = 15;//tamanho inicial da snake 
        Snake.direcao = 1;//direcao inicial da snake
        Jogo.tempo = 0;
        Jogo.pontos = 0;
        Estrelas.lista = new Array();
        for(i=0;i<Snake.tamanho;i++){
            Snake.corpo[i]={x:i, y:0}
        }
        Jogo._play();
        document.getElementById('pontos').innerHTML = '0';
        document.getElementById('box_score').style.visibility = 'visible';
    },//fecha iniciar
    _placar: function(){
        Jogo.pontos++;
        if(Jogo.pontos % 10 == 0){
            document.getElementById('pontos').innerHTML = Jogo.pontos;
        }//fecha o if
    },//fecha placar
    _play: function(){
        if(Jogo.play!='') clearInterval(Jogo.play);//reseta a tela, reconfigura o preenchimento e a velocidade da snake
        Jogo.play = setInterval(Canvas._preencher,Configuracao.velocidade);
    }, //fecha play
    _gameOver: function(){
        if(Jogo.play!='') clearInterval(Jogo.play);
    }, //fecha gameOver
    _pausar: function(){
        if(Jogo.play!=''){
            clearInterval(Jogo.play);
            Jogo.play='';//para o jogo
        }else{
            Jogo._play();
        }
    },//fecha pausar
    _controles: function(e,event){
        if(window.event){
            e = window.event;
        }//fecha if
        switch(e.keyCode){
            case 73: // tecla I
                Jogo._iniciar();
                e.preventDefault();
                break;
            case 80 : // tecla p 
                Jogo._pausar();
                e.preventDefault();
                break;
            case 37: //Esquerda
                if(Snake.ultimaDirecao!=1){
                    Snake.direcao = 3 ;
                }
                e.preventDefault();
                break;
            case 38: //para cima
                if(Snake.ultimaDirecao!=2){
                    Snake.direcao = 0 ;               
                }
                e.preventDefault();
                break;
            case 39: // direita
                if(Snake.ultimaDirecao!=3){
                    Snake.direcao = 1 ;
                }
                e.preventDefault();
                break;
            case 40: //cima
                if(Snake.ultimaDirecao!= 0){
                    Snake.direcao = 2;
                }
                e.preventDefault();
                break;
        }
    }//fecha controles
    
}//fecha var Jogo
window.onload = Canvas._init; //carrega o JS na janela principal
document.onkeydown = Jogo._controles;