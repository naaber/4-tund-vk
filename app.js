(function(){
   "use strict";

   var Moosipurk = function(){

     // SEE ON SINGLETON PATTERN
     if(Moosipurk.instance){
       return Moosipurk.instance;
     }
     //this viitab Moosipurk fn
     Moosipurk.instance = this;

     this.routes = Moosipurk.routes;
     // this.routes['home-view'].render()

     console.log('moosipurgi sees');

     // K�IK muuutujad, mida muudetakse ja on rakendusega seotud defineeritakse siin
     this.click_count = 0;
     this.currentRoute = null;
     console.log(this);
	 
	 //siin hakkan hoidma k�iki purke
	 this.jars = [];

     // Kui tahan Moosipurgile referenci siis kasutan THIS = MOOSIPURGI RAKENDUS ISE
     this.init();
   };

   window.Moosipurk = Moosipurk; // Paneme muuutja k�lge

   Moosipurk.routes = {
     'home-view': {
       'render': function(){
         // k�ivitame siis kui lehte laeme
         console.log('>>>>avaleht');
       }
     },
     'list-view': {
       'render': function(){
         // k�ivitame siis kui lehte laeme
         console.log('>>>>loend');

         //simulatsioon laeb kaua
         window.setTimeout(function(){
           document.querySelector('.loading').innerHTML = 'laetud!';
         }, 3000);

       }
     },
     'manage-view': {
       'render': function(){
         // k�ivitame siis kui lehte laeme
       }
     }
   };

   // K�ik funktsioonid l�hevad Moosipurgi k�lge
   Moosipurk.prototype = {

     init: function(){
       console.log('Rakendus l�ks t��le');

       //kuulan aadressirea vahetust
       window.addEventListener('hashchange', this.routeChange.bind(this));

       // kui aadressireal ei ole hashi siis lisan juurde
       if(!window.location.hash){
         window.location.hash = 'home-view';
         // routechange siin ei ole vaja sest k�sitsi muutmine k�ivitab routechange event'i ikka
       }else{
         //esimesel k�ivitamisel vaatame urli �le ja uuendame men��d
         this.routeChange();
       }
	   
	   //saan k�tte purgid localStorage'ist, kui on
	   if(localStorage.jars){
		   //v�tan stringi ja teen tagasi objektideks
		   this.jars = JSON.parse(localStorage.jars);
		   console.log('laadisin localStorageist massiivi ' + this.jars.length);
		   
		   //tekitan loendi htmli
		   this.jars.forEach(function(jar){
			   
			   var new_jar = new Jar(jar.title, jar.ingredients);
			   var li = new_jar.createHtmlElement();
			   document.querySelector('.list-of-jars').appendChild(li);
		   });
			
	   
	   }


       // esimene loogika oleks see, et kuulame hiireklikki nupul
       this.bindEvents();

     },

     bindEvents: function(){
       document.querySelector('.add-new-jar').addEventListener('click', this.addNewClick.bind(this));
	   
	   //kuulan tr�kkimist otsikastis
	   document.querySelector('#search').addEventListener('keyup', this.search.bind(this));
     },
	 
	 search: function(event){
		 //otsikasti v��rtus
		 var needle = document.querySelector('#search').value.toLowerCase();
		 console.log(needle);
		 
		 var list = document.querySelectorAll('ul.list-of-jars li');
		 console.log(list);
		 
		 for(var i=0; i <list.length; i++){
			 //�he listitemi sisu tekst
			 var li = list[i];
			 var stack = li.querySelector('.content').innerHTML;
			 
			 //kas otsis�na on sisus olemas
			 if(stack.indexOf(needle) !== -1){
				 //olemas
				 li.style.display = 'list-item';
			 }else{
				 //ei ole, indeks on -1
				 li.style.display = 'none';
			 }
		 }
	 },

     addNewClick: function(event){
       //salvestame purgi
       //console.log(event);

       var title = document.querySelector('.title').value;
       var ingredients = document.querySelector('.ingredients').value;

       //console.log(title + ' ' + ingredients);
       //1) tekitan uue Jar'i
       var new_jar = new Jar(title, ingredients);
	   console.log(new_jar);
	   
	   //lisan massiivi purgi
	   this.jars.push(new_jar);
	   console.log(JSON.stringify(this.jars));
	   //JSONI stringina salvestan localStorage'isse
	   localStorage.setItem('jars', JSON.stringify(this.jars));
	   
	   
       // 2) lisan selle htmli listi juurde
       var li = new_jar.createHtmlElement();
       document.querySelector('.list-of-jars').appendChild(li);


     },

     routeChange: function(event){

       //kirjutan muuutujasse lehe nime, v�tan maha #
       this.currentRoute = location.hash.slice(1);
       console.log(this.currentRoute);

       //kas meil on selline leht olemas?
       if(this.routes[this.currentRoute]){

         //muudan men�� lingi aktiivseks
         this.updateMenu();

         this.routes[this.currentRoute].render();


       }else{
         /// 404 - ei olnud
       }


     },

     updateMenu: function() {
       //http://stackoverflow.com/questions/195951/change-an-elements-class-with-javascript
       //1) v�tan maha aktiivse men��lingi kui on
       document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace('active-menu', '');

       //2) lisan uuele juurde
       //console.log(location.hash);
       document.querySelector('.'+this.currentRoute).className += ' active-menu';

     }

   }; // MOOSIPURGI L�PP

   var Jar = function(new_title, new_ingredients){
     this.title = new_title;
     this.ingredients = new_ingredients;
     console.log('created new jar');
   };

   Jar.prototype = {
     createHtmlElement: function(){

       // v�ttes title ja ingredients ->
       /*
       li
        span.letter
          M <- title esimene t�ht
        span.content
          title | ingredients
       */

       var li = document.createElement('li');

       var span = document.createElement('span');
       span.className = 'letter';

       var letter = document.createTextNode(this.title.charAt(0));
       span.appendChild(letter);

       li.appendChild(span);

       var span_with_content = document.createElement('span');
       span_with_content.className = 'content';

       var content = document.createTextNode(this.title + ' | ' + this.ingredients);
       span_with_content.appendChild(content);

       li.appendChild(span_with_content);

       return li;

     }
   };

   // kui leht laetud k�ivitan Moosipurgi rakenduse
   window.onload = function(){
     var app = new Moosipurk();
   };

})();