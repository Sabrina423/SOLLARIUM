window.addEventListener('scroll', function() {
    var header = document.querySelector('header');
    var main = document.querySelector('main');

    if (window.pageYOffset > 100) { /* Se o usuário rolar para baixo mais do que 100 pixels */
        header.classList.add('header-fixed'); /* Adiciona a classe para fixar o cabeçalho */
        main.classList.add('main-transition'); /* Adiciona a classe para animar o conteúdo principal */
    } else {
        header.classList.remove('header-fixed'); /* Remove a classe para desfixar o cabeçalho */
        main.classList.remove('main-transition'); /* Remove a classe para remover a animação do conteúdo principal */
    }
});
