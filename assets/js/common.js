$(document).ready(function() {
/*Form validation
--------------------------------------------------------*/
	
	var valdationErr = 0,

	//border styles
	errBorder = '#FF5722',
	normBorder = '#666666';

	//проверяет на пустоту, либо минимальную длину строки в инпуте. также проверка по регэкспу
	Validate = function(el, minLength, maxLength, regularExp) {
		minLength = minLength || 1;//присваиваем переданное значение или по умолчанию
		maxLength = maxLength || 100;
		var tmp = el.val(),
			err = 0;

		//console.log(minLength,'<',tmp.length,'<',maxLength);

		if (tmp.length < minLength || tmp.length > maxLength){	//длина строки входит в диапазон?
			err++;
			el.prev().addClass('errMess');
			el.css('border-color', errBorder);
		}else if (regularExp == undefined){		//со строкой все ок, но есть ли регэксп?
			el.prev().removeClass('errMess');
			el.css('border-color', normBorder);
		}else if (!regularExp.test(tmp)){		//есть, проверим-ка
			err++;
			el.prev().addClass('errRegExp');
			el.css('border-color', errBorder);
		}else{									//не, все ок. вернем форму в исходное сост.
			el.css('border-color', normBorder);
			el.prev().removeClass('errMess');
			el.prev().removeClass('errRegExp');
		}
		return err;
	}


	var title = $('[name="title"]'),
		author = $('[name="author"]'),
		year = $('[name="year"]'),
		pages = $('[name="pages"]');

	$('form').submit(function (e) {
		var error1 = 0,
		    error2 = 0,
		    error3 = 0,
		    error4 = 0;
		
		var fourNum = new RegExp(/^[1-9][0-9]{0,3}$/);	//год может быть от 1, до 9999
		
		error1 = Validate(title);
		error2 = Validate(author);
		error3 = Validate(year, 1, 4, fourNum);
		error4 = Validate(pages);
		console.log('ошибочки:',error1,error2,error3,error4);
        if ((error1 != 0) || (error2 != 0) || (error3 != 0) || (error4 != 0)){
        	valdationErr++;
        	return false;
        }else{
        	valdationErr = 0;
        	return true;
        }
    });

/*Работа с localStorage
---------------------------------------------------*/
	var	editNow = false,//флажок, который подсказывает редактируется сейчас файл или нет
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
					tmp = '<div class="article-body" bookId="'+key+'"><h2>'+tmp.title+'</h2><p>'+tmp.author+'</p><footer><div class="btn delete"></div><div class="btn edit"></div></footer></div>';
					//$('#form').after(tmp);
					$(".main-column").prepend(tmp);
				}
				else console.log('значение по ключу',key,'пустое');				
			}
		}
	}

	ShowBooks();

	$("#send").on('submit', function (e) {
		e.preventDefault();
		if (valdationErr == 0){
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
			    $(".main-column").prepend('<div class="article-body" bookId="'+id+'"><h2>'+book.title+'</h2><p>'+book.author+'</p><footer><div class="btn delete"></div><div class="btn edit"></div></footer></div>');
			}else{//Редактирование книги
		    	dataObj = {
			    	title: $('[name="title"]').val(),
			    	author: $('[name="author"]').val(),
			    	year: $('[name="year"]').val(),
			    	pages: $('[name="pages"]').val()
		    	};
		    	$('#send input:not(input:submit)').val('');

		    	thisBook.find('h2').text(dataObj.title);
		    	thisBook.find('p').text(dataObj.author);
		    	var serialBook = JSON.stringify(dataObj);
		    	localStorage.setItem(key,serialBook);
		    	editNow=false;
		    	thisBook.find('.edit').removeClass('act');
		    	thisBook.removeClass('active');
			}
		}else{
			return false;
		}
	});

	//удаление 
	$('main').on('click','.delete', function(){
		if(!editNow && confirm('Точно-точно?')){
			var bId = $(this).parent().parent().attr('bookId');
			//console.log('удаление по ключу',bId);
			localStorage.removeItem(bId);

			$(this).parent().parent().remove();
			//если удалили книгу, которая редактировалась
			$('#send input:not(input:submit)').val('');
			editNow = false;
		}else alert('Закончите редактирование!');
	});

	//редактирование 
	$('main').on('click','.edit', function(){
		if (!editNow){
			thisBook = $(this).parent().parent();
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
	    	thisBook.find(".edit").removeClass('act');
	    	thisBook.removeClass('active');
	    	$('#send input:not(input:submit)').val('');
	    }
	});


});