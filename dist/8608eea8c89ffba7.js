import"./load.css";var i=0;if(0==i){i=1;var elem=document.getElementById("myBar"),width=1,id=setInterval(frame,75);function frame(){width>=100?(clearInterval(id),i=0):(width++,elem.style.width=width+"%"),100===width&&document.querySelector(".btn-log").classList.add("ended")}}