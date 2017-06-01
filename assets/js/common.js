$(document).ready(function() {

	var bookList = $('#bookList'),
		editNow = false,//флажок, который подсказывает редактируется сейчас файл или нет
		thisBook;//будет хранится указатель на выбранную книгу


	function ShowBooks(){
		//находим max ключь и выводим книги от min ключа
		var lsLength = localStorage.length;
		if (lsLength > 0){
			for (var i=0; i < lsLength; i++){
			
				key = localStorage.key(i);
				
				if(localStorage.getItem(key).length > 0){
					//по выбранному ключу получаем значение из хранилища и парсим обратно в объект
					var tmp = JSON.parse(localStorage.getItem(key));
					//генерируем книгу с названием и автором
					tmp = '<li bookId="'+key+'"><header><h1>'+tmp.title+'</h1><p>'+tmp.author+'</p></header><div class="btn delete"></div><div class="btn edit"></div></li>'
					bookList.prepend(tmp);
				}
				else console.log('значение по ключу',key,'пустое');				
			}
		}
	}

	ShowBooks();

	$("#send").on('submit', function (e) {
		e.preventDefault();
		//флажок подскажет: редактировать или создать новую книгу
	    if (!editNow){//Создание новой книги
			//выборка данных
		    var book = {
		    	title: $('[name="title"]').val(),
		    	author: $('[name="author"]').val(),
		    	year: $('[name="year"]').val(),
		    	pages: $('[name="pages"]').val()
		    };

		    //сериализируем в json строку
		    var serialBook = JSON.stringify(book);

		    //отчистка полей
		    $('#send input:not(input:submit)').val('');

		    try{//проверка на заполненность
		    	localStorage.setItem('key','qwerty');
		    } catch (e) {
		    	if (e == QUOTA_EXCEEDED_ERR){
		    		console.error("Лимит локального хранилища превышен!");
		    	}
		    }
		    localStorage.removeItem('key');
		    
		    //ищем максимальный id в хранилище и инкрементим его
		    var nId = 0;
		    var lsLength = localStorage.length;
		    if(lsLength>0){
				for(var i = 0; i < lsLength; i++){
					var id = parseInt(localStorage.key(i),10);
					//console.log('id',id);
					if(nId < id) nId = id;
				}
				//console.log('MAX Id',nId);
		    }
		    nId++;
		    

			//формируем ключ
			nId +="";
		    var n = 7 - nId.length,
		    	id = 0;
		    //дополняя nId нулями
		    for (var i = 1; i < n; i++)
		    	id += "0";
		    id += nId;

		    //схраняем и генерируем книгу
		    localStorage.setItem(id,serialBook);
		    bookList.prepend('<li bookId="'+id+'"><header><h1>'+book.title+'</h1><p>'+book.author+'</p></header><div class="btn delete"></div><div class="btn edit"></div></li>');
		}else{//Редактирование книги
	    	dataObj = {
		    	title: $('[name="title"]').val(),
		    	author: $('[name="author"]').val(),
		    	year: $('[name="year"]').val(),
		    	pages: $('[name="pages"]').val()
	    	};
	    	$('#send input:not(input:submit)').val('');

	    	thisBook.find('h1').text(dataObj.title);
	    	thisBook.find('p').text(dataObj.author);
	    	var serialBook = JSON.stringify(dataObj);
	    	localStorage.setItem(key,serialBook);
	    	editNow=false;
	    	thisBook.find('.edit').removeClass('act');
	    	thisBook.removeClass('active');
		}
	});

	//удаление 
	$('#bookList').on('click','.delete', function(){
		if(confirm('Точно-точно?')){
			var bId = $(this).parent().attr('bookId');
			//console.log('удаление по ключу',bId);
			localStorage.removeItem(bId);
			$(this).parent().remove();

			//если удалили книгу, которая редактировалась
			$('#send input:not(input:submit)').val('');
			editNow = false;
		}
	});

	//редактирование 
	$('#bookList').on('click','.edit', function(){
		thisBook = $(this).parent();
		if (!editNow){
			editNow = true;

			//получаем ключ выбранного элемента
			key = thisBook.attr('bookId');
			//console.log('редактирование по ключу',key);

			$(this).addClass('act');
			thisBook.addClass('active');

			//берем значение по ключу в json
			var data = localStorage.getItem(key),
				dataLength = data.length;

		    if(dataLength>0){
				var dataObj = JSON.parse(data);
				$('[name="title"]').val(dataObj.title);
				$('[name="author"]').val(dataObj.author);
				$('[name="year"]').val(dataObj.year);
				$('[name="pages"]').val(dataObj.pages);
		    }
	    }else{
	    	editNow = false;
	    	$(this).removeClass('act');
	    	thisBook.removeClass('active');
	    	$('#send input:not(input:submit)').val('');
	    }
	});
});