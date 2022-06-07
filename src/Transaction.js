export default{
    paymentMethodText: function(paymentMethod){
        switch(paymentMethod){
            case "prepaid":
                return "Prépayé"
            case "cash":
                return "Comptant"
            case "interact":
                return "Interact"
            case "bankTransfer":
                return "Transfert Bancaire"
        }
    }
}
