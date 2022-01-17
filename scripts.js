const Modal = {
    open() {
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')
    },
    close() {
        document.getElementById("description").value = ""
        document.getElementById("amount").value = ""
        document.getElementById("date").value = ""
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    }
}

let transactions = []

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("ls-transactions")) || []
    },

    set() {
        localStorage.setItem("ls-transactions", JSON.stringify(transactions))
    }
}

function addIncomes() {
    let incomeTotal = 0
    transactions.forEach((transaction) => {
        if (transaction.type == "income") {
            incomeTotal += transaction.value
        }
    })
    return incomeTotal
}

function addOutcomes() {
    let outcomeTotal = 0
    transactions.forEach((transaction) => {
        if (transaction.type == "outcome") {
            outcomeTotal += transaction.value
        }
    })
    return outcomeTotal
}

function calculateTotal() {
    let totalAmount = 0
    totalAmount = addIncomes() - addOutcomes()
    return totalAmount
}

function populateValues() {

    transactions = Storage.get()

    let Income = document.getElementById("incomeTotal")
    let Outcome = document.getElementById("outcomeTotal")
    let Total = document.getElementById("calculateTotal")

    Income.innerHTML = Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL', minimumFractionDigits: 2}).format(addIncomes())
    if (addOutcomes() == 0) {
        Outcome.innerHTML = Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL', minimumFractionDigits: 2}).format(addOutcomes())

    } else {
        Outcome.innerHTML = "-" + Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL', minimumFractionDigits: 2}).format(addOutcomes())
    }
    Total.innerHTML = Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL', minimumFractionDigits: 2}).format(calculateTotal())

    let elements = document.getElementById("elements")
    elements.innerHTML = ``
    
    transactions.forEach((transaction, index) => {
        elements.innerHTML += `
            <tr>
                <td>${transaction.description}</td>
                <td class="${transaction.class}">${Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL', minimumFractionDigits: 2}).format(transaction.value)}</td>
                <td>${transaction.date}</td>
                <td>
                    <a href="#" id="${index}" onclick="deleteItem(${index})"><img src="./assets/minus.svg" alt="Remover transação"></a>
                    
                </td>
            </tr>
        `
    })
}

function deleteItem(index) {
    transactions.splice(index, 1)
    Storage.set()
    populateValues()
}

const Form = {

    getDescValue() {
        return document.getElementById("description").value
    },
    
    getAmountValue() {
        return document.getElementById("amount").value
    },

    getDateValue() {
        return document.getElementById("date").value
    },
    
    submit(event) {
        event.preventDefault()

        let description = this.getDescValue()
        let amount = this.getAmountValue()
        let date = this.getDateValue()
        let expenseResult
        let newClass

        if (description == "" || amount == "" || date == "") {
            return alert("Preencha todos os campos")
        } else {
            if (amount < 0) {
                expenseResult = "outcome"
                newClass = "negative"
                amount = amount*(-1)
            } else {
                expenseResult = "income"
                newClass = "positive"
            }
            let newTransaction = {
                type: expenseResult,
                class: newClass,
                description: description,
                value: Number(amount),
                date: date.split("-")[2] + "/" + date.split("-")[1] + '/' + date.split("-")[0]
            }
            transactions.push(newTransaction)
            Modal.close()
            Storage.set()
            populateValues()           
        }
        
    },

}

//salvar os dados no localStorage
//Manter os dados ao atualizar a página



console.log(Storage.get())



populateValues()




