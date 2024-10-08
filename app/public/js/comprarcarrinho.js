document.addEventListener("DOMContentLoaded", function () {
    // Inicialize o Mercado Pago com as credenciais e o idioma
    const mercadopago = new MercadoPago('APP_USR-241135b5-df1a-48b8-bfe3-985304c1e399', {
        locale: 'pt-BR' // Idioma, 'pt-BR' é o mais comum para o Brasil
    });

    // Handle call to backend and generate preference.
    document.getElementById("checkout-btn").addEventListener("click", function () {
        // Desabilita o botão de checkout enquanto processa
        $('#checkout-btn').attr("disabled", true);

        const items = document.querySelectorAll(".products .item");
        
        // Array para armazenar os dados extraídos
        const extractedData = [];

        // Itera sobre cada item para extrair os dados
        items.forEach(item => {
            const price = parseFloat(item.querySelector("#summary-price").innerText.trim().replace('R$', '').replace(/\s/g, ''));
            const unit_price = Number(price.toFixed(2));
            const nameElement = item.querySelector(".item-name");
            const description = nameElement.childNodes[0].nodeValue.trim();
            const quantity = Number(nameElement.querySelector("#summary-quantity").innerText.trim());
            const currency_id = "BRL";

            extractedData.push({ unit_price, description, quantity, currency_id });
        });

        // Dados do pedido a serem enviados para o backend
        const orderData = { items: extractedData };

        // Envia a requisição para o backend para criar uma preferência de pagamento
        fetch("/create-preference", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (preference) {
            // Cria o botão de checkout com a preferência gerada
            createCheckoutButton(preference.id);

            // Oculta o carrinho de compras e mostra a tela de pagamento
            $(".shopping-cart").fadeOut(500);
            setTimeout(() => {
                $(".container_payment").fadeIn(500);
            }, 500);
        })
        .catch(function () {
            alert("Unexpected error occurred");
            $('#checkout-btn').attr("disabled", false); // Reabilita o botão em caso de erro
        });
    });

    // Função para criar o botão de checkout com o ID da preferência
    function createCheckoutButton(preferenceId) {
        const bricksBuilder = mercadopago.bricks();

        const renderComponent = async (bricksBuilder) => {
            if (window.checkoutButton) window.checkoutButton.unmount();

            await bricksBuilder.create('wallet', 'button-checkout', {
                initialization: {
                    preferenceId: preferenceId
                },
                callbacks: {
                    onError: (error) => console.error(error),
                    onReady: () => {}
                }
            });
        };

        renderComponent(bricksBuilder);
    }

    // Função para voltar ao carrinho de compras
    document.getElementById("go-back").addEventListener("click", function () {
        $(".container_payment").fadeOut(500);
        setTimeout(() => {
            $(".shopping-cart").fadeIn(500);
        }, 500);
        $('#checkout-btn').attr("disabled", false); // Reabilita o botão ao voltar
    });
});
