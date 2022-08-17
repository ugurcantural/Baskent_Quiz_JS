//Bu projede benden çok çok daha fazla emeği bulunan Sadık Turan hocama teşekkürler..

function Soru(soruMetni, cevapSecenekleri, dogruCevap) {
    this.soruMetni = soruMetni;
    this.cevapSecenekleri = cevapSecenekleri;
    this.dogruCevap = dogruCevap;
}

Soru.prototype.cevabiKontrolEt = function(cevap) {
    return cevap === this.dogruCevap
}

let sorular = [
    new Soru("1-Aşağıdakilerden hangisi Türkiye'nin başkentidir?", { a: "İstanbul", b: "Ankara", c: "İzmir" , d: "Bursa" }, "b"),
    new Soru("2-Aşağıdakilerden hangisi Belçika'nın başkentidir?", { a: "Brüksel", b: "Brugge", c: "Liege" , d: "Gent" }, "a"),
    new Soru("3-Aşağıdakilerden hangisi Çin'in başkentidir?", { a: "Şanghay", b: "Guangzhou", c: "Pekin" , d: "Vuhan" }, "c"),
    new Soru("4-Aşağıdakilerden hangisi İsviçre'nin başkentidir?", { a: "Basel", b: "Cenevre", c: "Zürih" , d: "Bern" }, "d"),
    new Soru("5-Aşağıdakilerden hangisi İsveç'in başkentidir?", { a: "Malmö", b: "Stokholm", c: "Göteborg" , d: "Uppsala" }, "b")
];

function Quiz(sorular) {
    this.sorular = sorular;
    this.soruIndex = 0;
    this.DogruCevapSayisi = 0;
}

Quiz.prototype.soruGetir = function() {
    return this.sorular[this.soruIndex];
}

const quiz = new Quiz(sorular);

document.querySelector(".btn_anladim").addEventListener("click", function() {
    document.querySelector(".rules").classList.remove("active");
});

document.querySelector(".btn_rules").addEventListener("click", function() {
    document.querySelector(".rules").classList.add("active");
});

document.querySelector(".btn_start").addEventListener("click", function() {
    document.querySelector(".quiz_box").classList.add("active");
    startTimer(10);
    startLine();
    soruGoster(quiz.soruGetir());
    SoruSayisiniGoster(quiz.soruIndex + 1, quiz.sorular.length);
    document.querySelector(".next_btn").classList.remove("show");
});

document.querySelector(".next_btn").addEventListener("click", function() {
    if (quiz.sorular.length != quiz.soruIndex + 1) {
        quiz.soruIndex += 1;
        clearInterval(counter);
        clearInterval(counterLine);
        startTimer(10);
        startLine();
        soruGoster(quiz.soruGetir());
        SoruSayisiniGoster(quiz.soruIndex + 1, quiz.sorular.length);
        document.querySelector(".next_btn").classList.remove("show");
        //soru sayısı - 1 = 4
        if (quiz.soruIndex == 4) {
            document.querySelector(".next_btn").textContent = "Testi Bitir";
        }
    } else {
        clearInterval(counter);
        clearInterval(counterLine);
        document.querySelector(".quiz_box").classList.remove("active");
        document.querySelector(".score_box").classList.add("active");
        skorGoster(quiz.sorular.length, quiz.DogruCevapSayisi);
        document.querySelector(".next_btn").textContent = "Sonraki Soru";
    }
});

document.querySelector(".btn_replay").addEventListener("click", function(){
    quiz.soruIndex = 0;
    quiz.DogruCevapSayisi = 0;
    document.querySelector(".btn_start").click();
    document.querySelector(".score_box").classList.remove("active");
    document.querySelector(".score_box .icon").innerHTML = "";
});

document.querySelector(".btn_quit").addEventListener("click", function(){
    //Sayfa Yeniden Yüklenir;
    window.location.reload();
});

const option_list = document.querySelector(".option_list");
const correctİcon = `<div class="icon"><i class="fas fa-check"></i></div>`
const incorrectİcon = `<div class="icon"><i class="fas fa-times"></i></div>`

function soruGoster(soru) {
    let question = `<span>${soru.soruMetni}</span>`;
    let options = '';

    for(let cevap in soru.cevapSecenekleri) {
        options += 
            `
                <div class="option"> 
                    <span><b>${cevap}</b>: ${soru.cevapSecenekleri[cevap]}</span>
                </div>
            `;
    }

    document.querySelector(".question_text").innerHTML = question;
    option_list.innerHTML = options;

    const option = option_list.querySelectorAll(".option");

    for (let opt of option) {
        opt.setAttribute("onclick", "optionSelected(this)");
    }

}

function optionSelected(option) {
    clearInterval(counter);
    clearInterval(counterLine);
    let cevap = option.querySelector("span b").textContent;
    let soru = quiz.soruGetir();

    if(soru.cevabiKontrolEt(cevap)) {
        quiz.DogruCevapSayisi += 1;
        option.classList.add("correct");
        option.insertAdjacentHTML("beforeend", correctİcon);
    }
    else {
        option.classList.add("incorrect");
        option.insertAdjacentHTML("beforeend", incorrectİcon);
    }

    for (let i = 0; i < option_list.children.length; i++) {
        option_list.children[i].classList.add("disabled");
    }

    document.querySelector(".next_btn").classList.add("show");
}

function SoruSayisiniGoster (soruSayisi, toplamSoru) {
    let tag = `<span class="badge bg-warning"> ${soruSayisi}/${toplamSoru} </span>`;
    // quiz_box içerisindeki  question_index'e tag'i ekle
    document.querySelector(".quiz_box .question_index").innerHTML = tag;
}

function skorGoster (toplamSoru, dogruCevap) {

    if (quiz.DogruCevapSayisi == 0) {
        let yanlisİcon = `<i class="fa-regular fa-ban"></i>`;
        document.querySelector(".score_box .icon").innerHTML = yanlisİcon;
        let yanlisTag = `Maalesef! Hiçbir soruya doğru cevap veremediniz.`;
        document.querySelector(".score_box .score_text").innerHTML = yanlisTag;
    }
    else {
        for (let index = 1; index <= quiz.DogruCevapSayisi; index++) {
            let dogruİcon = `<i class="fas fa-crown"></i>`;
            document.querySelector(".score_box .icon").innerHTML += dogruİcon;
        }
        let dogruTag = `Tebrikler! Toplam ${toplamSoru} sorudan ${dogruCevap} doğru cevap verdiniz.`;
        document.querySelector(".score_box .score_text").innerHTML = dogruTag;
    }
}

let counter;
function startTimer(time) {
    //1 Saniyeden Say
    counter = setInterval(timer, 1000);
    
    function timer(){
       document.querySelector(".time_second").textContent = time;
       time--;

       if (time < 0) {
            clearInterval(counter);
            //document.querySelector(".time_text").textContent = "Süre Bitti";

            for (let option of option_list.children) {
                option.classList.add("disabled");
                option.classList.add("timeout");
            }
            document.querySelector(".next_btn").classList.add("show");
       }
    }
}

let counterLine;
function startLine() {
    let line_width = 0;

    counterLine = setInterval(timer, 100);

    function timer() {
        line_width += 5;
        document.querySelector(".time_line").style.width = line_width + "px";
        if (line_width > 549) {
            clearInterval(counterLine);
        }
    }
}