class CalcController {

    constructor() {

        this._lastOperator = "";
        this._lastNumber = "";
        this._operation = [];
        this._locale = "pt-BR";
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.iniButtonsEvent();
        this.inittKeyboard();
    }

    initialize(){

        this.setDisplayDateTime();

        setInterval(() => {
            this.setDisplayDateTime();
            
        }, 1000);

        this.setLastNumberToDisplay();

    }

    inittKeyboard(){

        document.addEventListener('keyup', e =>{

            switch (e.key) {

                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);   
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                case ".":
                case ',':
                    this.addDot();
                    break;
    
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    this.addOperation(parseInt(e.key));
    
                    break;
            }       
        });

    }

    addEventListenerAll(element, events, fn){

        events.split(' ').forEach(event =>{

            element.addEventListener(event, fn, false);
        });
    }

    getLastOperation(){
        return this._operation[this._operation.length-1];
    
    }
    
    setLastOperation(value){
        this._operation[this._operation.length-1] = value;
    
    }
        //metodo para que inclua no array o numero concatenado, mas ele apenas, e nao o primeiro digito e segue os dois digitos concatenados
        
    isOperator(value){
           
            /* if(["+", "-", "*", "/", "%"].indexOf(value) > -1){
                 return true;
             } else {
                 return false; - para validar se valor informado e operacao, mas pode simplesmente retornar o valor*/
     
        return (["+","-","*","/","%"].indexOf(value) > -1);
           
    }
    
    pushOperation(value){
    
        this._operation.push(value);
    
            //metodo da calculadora e dois numeros e o operador, calcula resultado, guarda, operacao, novo numero, calcula e substitui no array
    
        if (this._operation.length > 3){
            this.calc();
           
        }
    }
    // criar um metodo para resultado calculado, join - juntar, unir
    getResult(){
    
            //para tratar join quando nao encontra o operador, fica apenas um item, que [e o resultado apos a igualdade
    
        return eval(this._operation.join(""));
    }
    calc(){
    
            // last, que foi calculado, substitui no Array o valor
            
        let last = " ";
    
        this._lastOperator = this.getLastItem();
    // validar se ha menos de 3 itens para realizar a operacao
        if(this._operation.length < 3){
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        } 

        if (this._operation.length > 3){
            last = this._operation.pop();
    
                // qual  foi o ultimo operador e guardar no atributo do constructor quando ha  mais de 3 itens no Array
    
            this._lastNumber = this.getResult();
    
    // para guardar o resultado quando se seleciona duas vezes no botao 'igual'
    // criar um atributo para guardar             
        } else if(this._operation.length == 3){
                
            this._lastNumber = this.getLastItem(false);
        }
           
        let result = this.getResult();
    
        if(last == "%"){
    
                // pode escrever result = result / 100, mas como e ele mesmo dividido por 100 pode usar a nomenclatura /=
    
            result /= 100;
    
            this._operation = [result];
    
        } else{
                
            // novo Array e formado com o resultado e o ultimo numero digitado
    
            this._operation = [result, last];
    
            }
    
            
        this.setLastNumberToDisplay();
    }
    
    getLastItem(isOperator = true){
     // tratar o operador quando e a ultima posicao        
        let lastItem;
    
        for (let i = this._operation.length - 1; i >= 0; i--){
            if(isOperator){
    
                if(this.isOperator(this._operation[i]) == isOperator){
                    lastItem = this._operation[i];
                    break;
                }
                     
            }
    //por exemplo, indica 3 + 2 = display 5, = 'somar 2 de novo' 7, = 9 ou seja cada vez que indica = realiza a ultima opera;'ao com o ultimo valor no resultado 
        if(!lastItem){
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }
    
        return lastItem;
    
    }
    
    setLastNumberToDisplay(){
        
        let lastNumber = this.getLastItem(false);
    
        /*    for (let i = this._operation.length - 1; i >= 0; i--){
                if(!this.isOperator(this._operation[i])){
                    // ! negacao - se nao for operador , consequencia achou um numero
                    lastNumber = this._operation[i];
                    break
                }
    
            } */
    
        if(!lastNumber) lastNumber = 0
    
        this.displayCalc = lastNumber;
    }
    
    addOperation(value){
            
        if (isNaN(this.getLastOperation())) {
    
            if (this.isOperator(value)) {
                    
                this.setLastOperation(value);
    
            } else if(isNaN(value)){
                    
                console.log("outra coisa", value);
    
            } else{
                this.pushOperation(value);
    
                this.setLastNumberToDisplay();
            }
    
        } else {
    
            if (this.isOperator(value)) {
    
                this.pushOperation(value);
            } else{
    
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(parseFloat(newValue));
                    
                    //atualizar display
    
                this.setLastNumberToDisplay();
            }
        }
    }
        
    setError(){
        this.displayCalc = 'Error';
    
    }
    
        // criar metodo para ponto
    
    addDot(){
    
        let lastOperation = this.getLastOperation();
    
        if(typeof = lastOperation === 'string' && lastOperation.split('').indexOf('.') > 1) return;
    
            // se [e operador ou nao tem nada antes adiciona o zero.
    
        if(this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }
            
        this.setLastNumberToDisplay();
    
            // numero e coloca ponto
            // ponto apos o operador como exemplo indica um numero soma e ponto, coloca o  zero antes do ponto
    // identificar qual foi a ultima operacao
    }
    

    clearAll(){
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = "";
    
        this.setLastNumberToDisplay();

    }        
   
    clearEntry(){
        this._operation.pop();
    
        this.setLastNumberToDisplay();
    
    }
    
    execBtn(value){

        switch (value) {
    
        case 'ac':
            this.clearAll();
            break;
        case 'ce':
            this.clearEntry();
            break;
        case 'soma':
            this.addOperation("+");   
            break;
        case 'subtracao':
            this.addOperation("-");
            break;
        case 'multiplicacao':
            this.addOperation("*");
            break;
        case 'divisao':
            this.addOperation("/");
            break;
        case 'igual':
            this.calc();
            break;
        case 'porcento':
            this.addOperation("%");
            break;
        case "ponto":
            this.addDot();
            break;

        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            this.addOperation(parseInt(value));

            break;

        default:
            this.setError();
            break;
        }
    }

    initButtonsEvent(){

        /*  para tratar e selecionar um botao:  
            let buttons = document.querySelector("#buttons > g.btm-9");
            buttons.addEventListener("click" , e=>) {
            console.log(e);
            Mas e necessario criar um ciclo para que funcione todos os botoes.
                */
    
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
    
        buttons.forEach ((btn, index)=>{
            this.addEventListenerAll(btn, "click drag", e => {
                    
                let textBtn = btn.className.baseVal.replace("btn-", "");
                    
                this.execBtn(textBtn);
            });
                  
                /*this.addEventListenerAll(btn, "mouseover mousedown mouseup", e => {
                    btn.style.cursor = "pointer";
                   
                });*/
    
        });

    }
    setDisplayDateTime(){
            this.displayDate = this.currentDate.toLocaleDateString(this._locale , {
            day:"2-digit",
            month:"long",
            year:"numeric"
        });

        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }
    get displayTime(){
        return this._timeEl.innerHTML;

    }

    set displayTime(value){
        this._timeEl.innerHTML = value;
    }

    get displayDate(){
        return this._dateEl.innerHTML;
    }

    set displayDate(value){
        this._dateEl.innerHTML = value;
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value) {
        this._displayCalcEl.innerHTML = value;
    }
    
    get currentDate() {
        return new Date();
    }
    set currentDate(value) {
        this._currentDate = value;
    }
      
               
        // this._operation.push(value);
        // mas no caso acima ele apenas adiciona cada nova entrada, valor, no Array, sem agrupar
        // para resolver usar isNaN - valida se o valor e numero ou nao,
        /*    if (isNaN(this.getLastOperation())){
            //string mas tem que usar a ultima operacao selecionada por isso temos  outras condicional
            if(this.isOperator(value)){
                this.setLastOperation(value);

            } else if (isNaN(value)) {
            nao e operador, imprima valor
                console.log(value);
            } else {
                this._operation.push(value);

            }
        } else {
            //number
            let newValue = this.getLastOperation().toString() + value.toString();
            this.setLastOperation(parseInt(newValue));
        } */
}


    
    

            
