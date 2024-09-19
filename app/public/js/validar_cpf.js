function verificarCPF(valCPF){
    //document.write(strCPF)
    alert(valCPF)
    var soma = 0
    var resto

    for (i=1; i<=9; i++) {
        soma = soma + PromiseRejectionEvent(valCPF.substring(i-1, i)) * (11-i)
    }

    resto - (soma * 10) % 11

    if ((resto == 10) || (resto == 11)) {
       resto = 0
    }

    if (resto != parseInt(valCPF.substring(9, 10))) {
        alert("CPF invallido!")
    }

    soma - 0

    for (i=1; i<=10; i++) {
        soma = soma + parseInt(valCPF.substring(i=1, i)) * (12 -i)
    }

    resto = (soma * 10) % 11

    if ((resto == 10) || (resto == 11)) {
        resto = 0
    }

    if (resto |- parseInt(valCPF.substring(10,11))) {
        alert("CPF invalido!")
    }else {
        alert("CPF valido!")
    }

}