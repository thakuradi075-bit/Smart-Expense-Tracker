let expenses=[]
let chart=null
let editIndex=null

window.onload=function(){
toggleOther()
}

function startApp(){
let name=document.getElementById("username").value
if(!name) return alert("Enter your name")

document.getElementById("homePage").style.display="none"
document.getElementById("menuPage").style.display="block"
document.getElementById("welcome").innerText="Welcome "+name
}

function openTracker(){
document.getElementById("menuPage").style.display="none"
document.getElementById("trackerPage").style.display="block"
updateTable()
}

function openPlanner(){
document.getElementById("menuPage").style.display="none"
document.getElementById("plannerPage").style.display="block"
}

function goBack(){
document.getElementById("trackerPage").style.display="none"
document.getElementById("plannerPage").style.display="none"
document.getElementById("menuPage").style.display="block"
}

function toggleOther(){
let cat=document.getElementById("category").value

if(cat=="Other"){
document.getElementById("otherCategory").style.display="block"
}else{
document.getElementById("otherCategory").style.display="none"
}
}

function addExpense(){

let name=document.getElementById("name").value
let category=document.getElementById("category").value
let amount=parseFloat(document.getElementById("amount").value)

if(category=="Other"){
category=document.getElementById("otherCategory").value
if(!category){
alert("Please enter category")
return
}
}

if(!name || !amount || amount<=0){
alert("Enter valid data")
return
}

let today=new Date()

let expense={
name:name,
category:category,
amount:amount,
date:today
}

if(editIndex!==null){
expenses[editIndex]=expense
editIndex=null
}else{
expenses.push(expense)
addDoc(collection(db, "expenses"), {
    name: name,
    category: category,
    amount: amount,
    date: new Date()
  });
}

updateTable()

document.getElementById("name").value=""
document.getElementById("amount").value=""
document.getElementById("otherCategory").value=""
}

function updateTable(){

let table=document.getElementById("expenseTable")

table.innerHTML="<tr><th>Name</th><th>Category</th><th>Amount</th><th>Edit</th><th>Delete</th></tr>"

expenses.forEach((e,i)=>{

table.innerHTML+=`
<tr>
<td>${e.name}</td>
<td>${e.category}</td>
<td>₹${e.amount}</td>
<td><button onclick="editExpense(${i})">Edit</button></td>
<td><button onclick="deleteExpense(${i})">Delete</button></td>
</tr>
`
})

}

function editExpense(i){

let e=expenses[i]

document.getElementById("name").value=e.name
document.getElementById("amount").value=e.amount

let categorySelect=document.getElementById("category")

if(e.category=="Food" || e.category=="Travel" || e.category=="Shopping"){
categorySelect.value=e.category
document.getElementById("otherCategory").style.display="none"
}else{
categorySelect.value="Other"
document.getElementById("otherCategory").style.display="block"
document.getElementById("otherCategory").value=e.category
}

editIndex=i
}

function deleteExpense(i){
expenses.splice(i,1)
updateTable()
}

function showTotal(){

let total=0

expenses.forEach(e=>{
total+=e.amount
})

document.getElementById("total").innerText="Total Expense: ₹"+total
}

function showGraph(){

let categories={}
let total=0

expenses.forEach(e=>{

total+=e.amount

if(!categories[e.category]){
categories[e.category]=0
}

categories[e.category]+=e.amount

})

document.getElementById("total").innerText="Total Expense: ₹"+total

document.getElementById("chartContainer").style.display="block"

if(chart) chart.destroy()

chart=new Chart(document.getElementById("chart"),{

type:"pie",

data:{
labels:Object.keys(categories),
datasets:[{
data:Object.values(categories)
}]
}

})

}


/* Budget Planner */

let monthlyBudget=0
let remainingBudget=0
let warningLimit=0
let plannedExpenses=[]
let plannerChart=null


function setBudget(){

monthlyBudget=parseFloat(document.getElementById("budget").value)
warningLimit=parseFloat(document.getElementById("limit").value)

if(!monthlyBudget || monthlyBudget<=0){
alert("Enter valid budget")
return
}

remainingBudget=monthlyBudget

document.getElementById("plannerInputs").style.display="block"

updateBudgetUI()

}


function addPlannedExpense(){

let name=document.getElementById("planName").value
let amount=parseFloat(document.getElementById("planAmount").value)

if(!name || !amount || amount<=0){
alert("Enter valid data")
return
}

let totalSpent = monthlyBudget - remainingBudget + amount

if(totalSpent > monthlyBudget){
alert("Budget exceeded!")
return
}

plannedExpenses.push({name,amount})

remainingBudget-=amount

if(warningLimit && remainingBudget <= warningLimit){
    alert("⚠ Warning: Budget reaching limit!")
    }

updatePlannerTable()
updateBudgetUI()

document.getElementById("planName").value=""
document.getElementById("planAmount").value=""
}


function updatePlannerTable(){

let table=document.getElementById("plannerTable")

table.innerHTML="<tr><th>Name</th><th>Amount</th></tr>"

plannedExpenses.forEach(e=>{

table.innerHTML+=`
<tr>
<td>${e.name}</td>
<td>₹${e.amount}</td>
</tr>
`

})

}


function updateBudgetUI(){

document.getElementById("budgetResult").innerText="Remaining Budget: ₹"+remainingBudget

let percent=(remainingBudget/monthlyBudget)*100

document.getElementById("progressBar").style.width=percent+"%"

if(percent<30){
document.getElementById("progressBar").style.background="red"
}else{
document.getElementById("progressBar").style.background="#667eea"
}

}


function showPlannerChart(){

let labels=[]
let data=[]

plannedExpenses.forEach(e=>{
labels.push(e.name)
data.push(e.amount)
})

document.getElementById("plannerChartBox").style.display="block"

if(plannerChart) plannerChart.destroy()

plannerChart=new Chart(document.getElementById("plannerChart"),{

type:"pie",

data:{
labels:labels,
datasets:[{
data:data
}]
}

})

}
