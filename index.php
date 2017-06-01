<!DOCTYPE html>
<html>  
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>myLibrary</title>
	<link rel="icon" type="image/ico" href="assets/images/bookStack.ico">
	<link rel="stylesheet" type="text/css" href="assets/styles/style.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<script type="text/javascript" src="assets/js/common.js"></script>
</head>
<body>
	<header>Электронная библиотека</header>
	<main>
		<div class="form">
			<form id="send">
				<div class="title">Название</div>
				<input type="text" name="title" autocomplete="off">

				<div class="title">Автор</div>
				<input type="text" name="author" autocomplete="off">

				<div class="title">Год издания</div>
				<input type="text" name="year" autocomplete="off">

				<div class="title">Кол-во страниц</div>
				<input type="number" name="pages"><br>
				
				<input type="submit" name="add" value="Сохранить">
			</form>
		</div>
		<div class="list">
			<ul id="bookList">
			</ul>
		</div>
	</main>

</body>
</html>
