'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

function displayMovements(movement,sort=false){
           containerMovements.innerHTML='';

          const sortMovement= sort ? movement.slice().sort((a,b)=>b-a) : movement;
           sortMovement.forEach((mov,i)=>{
            const type= mov> 0 ? 'movements__type--deposit': 'movements__type--withdrawal';
              const html=`<div class="movements__row">
          <div class="movements__type ${type}">${i+1} deposit</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov}</div>
        </div>`;
        containerMovements.insertAdjacentHTML('afterbegin',html);
        })
}


const initials=(username)=> username.toLowerCase().split(' ').map((name)=>name[0]).join('');
accounts.forEach((acc)=>{
     acc.username = initials(acc.owner);
})

const calcSummary = (movements,currentAccount)=>{
           const summaryValIn= movements.filter((sumVal)=>{
                     return sumVal>0?sumVal: 0;
           })?.reduce((acc,curr,i,arr)=>{
                 return acc+curr;
           },0);

           const summaryValOut = movements.filter((minVal)=>{
            return minVal< 0 ? minVal : 0;
           })?.reduce((acc,curr,i,arr)=>{
              return acc+curr;
           },0)

            const interest = movements.filter((mov)=>{
            return mov>0 ? mov : 0;
           }).map((deposit)=>(deposit*currentAccount.interestRate)/100)?.reduce((acc,curr,i,arr)=>{
              return acc+curr;
           },0)
           labelSumIn.textContent = summaryValIn;
           const balanceAmount=summaryValIn-Math.abs(summaryValOut)
           currentAccount.balance=balanceAmount;
           labelBalance.textContent = currentAccount.balance;
           labelSumOut.textContent=Math.abs(summaryValOut);
           labelSumInterest.textContent = interest;

}

let currentAccount;
btnLogin.addEventListener('click',(e)=>{
         e.preventDefault();
          currentAccount=accounts.find((acc)=>{
           return acc.username===inputLoginUsername.value
          })

          if(currentAccount?.pin ===Number(inputLoginPin.value)){
             labelWelcome.textContent= `Welcome ${currentAccount.owner}`;
             containerApp.style.opacity=100;
          }else{
                labelWelcome.textContent= `Account does not exists!!!`;
          }
     
        displayMovements(currentAccount?.movements,false);
         if(currentAccount){
            calcSummary(currentAccount.movements,currentAccount);
         }
      
})

//Transfer logic
btnTransfer.addEventListener('click',(e)=>{
    e.preventDefault();
    let transfervalue;
    transfervalue=accounts.find((acc)=>{
      return acc.username === inputTransferTo.value;
    })

    
    if(transfervalue && transfervalue.username===inputTransferTo.value){
    if(Number(inputTransferAmount.value)>0 && Number(inputTransferAmount.value)<=currentAccount.balance ){
        transfervalue.movements.push(Number(inputTransferAmount.value));
        currentAccount.movements.push(-Number(inputTransferAmount.value));
        displayMovements(currentAccount.movements,false);
        calcSummary(currentAccount.movements,currentAccount);
    }else{
      labelWelcome.textContent = "Not Enough Balance!!!";
    }
  }else{
    labelWelcome.textContent = "Account not present or valid";
  }
  inputTransferTo.value = inputTransferAmount.value = "";
    console.log(transfervalue,currentAccount)
        
});
//Loan Logic
btnLoan.addEventListener('click',(e)=>{
  e.preventDefault();
  const requestedAmount = inputLoanAmount.value;
  if(requestedAmount > 0 && currentAccount.movements.some((mov)=> mov >= requestedAmount*0.1)){
     currentAccount.movements.push(requestedAmount);
     displayMovements(currentAccount.movements,false);
  }else{
        labelWelcome.textContent= `Requested Amount cannot be processed!!!`;
  }

})

//Close Account logic 
btnClose.addEventListener('click',(e)=>{
    e.preventDefault();
     let closeAccountVal;
    closeAccountVal=accounts.find((acc)=>{
      return acc.username === inputCloseUsername.value;
    })
    
    if(Number(inputClosePin?.value)=== closeAccountVal?.pin){
      let index=accounts.indexOf(closeAccountVal);
      accounts.splice(index,1);
        containerApp.style.opacity=0;
    }
      inputTransferTo.value = inputTransferAmount.value = "";
});
let sort=false;
btnSort.addEventListener('click',(e)=>{
  e.preventDefault();
       displayMovements(currentAccount.movements,!sort);
       
       sort = !sort;
})