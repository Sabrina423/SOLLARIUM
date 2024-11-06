let photoMenuVisible = false;
        let currentIndex = 0;

        function togglePhotoMenu() {
            const menu = document.getElementById('photo-menu');
            photoMenuVisible = !photoMenuVisible;
            menu.style.display = photoMenuVisible ? 'block' : 'none';
        }

        function removePhoto() {
            document.getElementById('profile-pic').src = 'default-profile.jpg';
            document.getElementById('file-input').value = '';
            togglePhotoMenu(); // Hide the menu after removing photo
        }

        document.getElementById('file-input').addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    document.getElementById('profile-pic').src = e.target.result;
                    togglePhotoMenu(); // Hide the menu after selecting photo
                }
                reader.readAsDataURL(file);
            }
        });


        function togglePhotoMenu(event) {
            if (event) {
                event.preventDefault(); // Previne o comportamento padrão
            }
            const menu = document.getElementById('photo-menu');
            photoMenuVisible = !photoMenuVisible;
            menu.style.display = photoMenuVisible ? 'block' : 'none';
        }

        function removePhoto() {
            document.getElementById('profile-pic').src = 'default-profile.jpg';
            document.getElementById('file-input').value = '';
            togglePhotoMenu(); // Esconde o menu após remover foto
        }

        document.getElementById('file-input').addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('profile-pic').src = e.target.result;
                    togglePhotoMenu(); // Esconde o menu após selecionar a foto
                }
                reader.readAsDataURL(file);
            }
        });

        document.addEventListener('click', function (event) {
            const menu = document.getElementById('photo-menu');
            const photoButton = document.querySelector('.photo-actions button');
            if (photoMenuVisible && !menu.contains(event.target) && event.target !== photoButton) {
                togglePhotoMenu();
            }
        });

        function saveProfile() {
            const fullName = document.getElementById('full-name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;

            // Aqui você pode adicionar a lógica para salvar as informações do perfil, 
            // como fazer uma requisição para um servidor.

            alert('Perfil salvo com sucesso!');
        }

        function showSlide(index) {
            const container = document.querySelector('.carousel-container');
            const totalSlides = container.children.length;
            if (index >= totalSlides) {
                currentIndex = 0;
            } else if (index < 0) {
                currentIndex = totalSlides - 1;
            } else {
                currentIndex = index;
            }
            container.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        function nextSlide() {
            showSlide(currentIndex + 1);
        }

        function prevSlide() {
            showSlide(currentIndex - 1);
        }

        // Inicializar o carrossel
        showSlide(currentIndex);





/***************** CEP  *****************/
//mascara CEP
const mascaraCEP = (event) => {
    let input = event.target;
    let value = input.value;
    
    if (!value) {
        input.value = "";
        return;
    }

    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');

    input.value = value;
}

function limpa_formulário_cep() {
    //Limpa valores do formulário de cep.
    document.getElementById('rua').value = ("");
    document.getElementById('bairro').value = ("");
    document.getElementById('cidade').value = ("");
    document.getElementById('uf').value = ("");
}

function meu_callback(conteudo) {
    if (!("erro" in conteudo)) {
        //Atualiza os campos com os valores.
        document.getElementById('rua').value = (conteudo.logradouro);
        document.getElementById('bairro').value = (conteudo.bairro);
        document.getElementById('cidade').value = (conteudo.localidade);
        document.getElementById('uf').value = (conteudo.uf);
    } //end if.
    else {
        //CEP não Encontrado.
        limpa_formulário_cep();
        notify("Aviso!", "CEP não encontrado!", "warning", "center")
    }
}

function pesquisacep(valor) {

    //Nova variável "cep" somente com dígitos.
    var cep = valor.replace(/\D/g, '');

    //Verifica se campo cep possui valor informado.
    if (cep != "") {

        //Expressão regular para validar o CEP.
        var validacep = /^[0-9]{8}$/;

        //Valida o formato do CEP.
        if (validacep.test(cep)) {

            //Preenche os campos com "..." enquanto consulta webservice.
            document.getElementById('rua   ').value = ("");
            document.getElementById('bairro').value = "...";
            document.getElementById('cidade').value = "...";
            document.getElementById('uf').value = "...";

            //Cria um elemento javascript.
            var script = document.createElement('script');

            //Sincroniza com o callback.
            script.src = 'https://viacep.com.br/ws/' + cep + '/json/?callback=meu_callback';

            //Insere script no documento e carrega o conteúdo.
            document.body.appendChild(script);

        } //end if.
        else {
            //cep é inválido.
            limpa_formulário_cep();
            notify("Erro!", "Formato de CEP inválido!", "error", "center")
        }
    } //end if.
    else {
        //cep sem valor, limpa formulário.
        limpa_formulário_cep();
    }
};

/*************** FIM CEP  ***************/