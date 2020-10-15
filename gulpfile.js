const 
    //development mode ? 
    // tu koristimo obaj switch da budemo u dev modu ! ! !  ! !  ! !  ! ! !  ! 
    devBuild = true,
    //tu mozemo staviti devBuild false, ako zelimo preci iz deva u produkciju, , tu samo odredjujemo kako se nasi taskovi ponasati ako smo u dev-u ili prod-u

    //modules turning off or on 
    gulp = require('gulp'),
    htmlclean = require('gulp-htmlclean');
    // tu smo dodali htmlclean kao requirement od gulpa

    noop = require('gulp-noop'),
    // ovaj noop paket omogucava da nas gulp ne napravi nista, umjesto false cemo ga koristiti

    sass = require('gulp-sass'),
    // tu smo stavili nas require za gulp-sass na sass varijablu 

    concat = require('gulp-concat'),
    // morali smo dodati paket za konkateniranje  ! za to da mozemo vise scss ili bootstrap scss fajlova u jedan nas glavni css

    //folders , definiramo source folder
    src = 'src/',
    build = 'public/';


////
//html processing
function html(){ // task koji mozemo zvatzi s gulpom!!!!!!!!!!
    //tu bi trebali oznaciti output gdje ce on spremati nas html.. a to je u public
    return gulp.src(src + 'html/**/*')
        .pipe(devBuild ? noop() : htmlclean()) //tu ne mozemo stavljati false ako ne zelimo da nista ne napravi, moramo umjesto false, dodati NOVI PAKET 'NOOP' koji nista ne radi ! 
        .pipe(gulp.dest(build));
    // tu se odvija logika taska:::::  krecemo od src pa to sve ide kroz nas napravljeni pipeline pa output ide u zavrsnu datoteku html
}


////
// css processing 
// ako koristimo bootstrap u css-u onda cemo koristiti cdn ! 
//brzo cemo dobiti podatke 
//moramo dodati pakete kroz npm:::: gulp-sass,  gulp-concat
function css(){  // task koji mozemo zvatzi s gulpom!!!!!!!!!!!
    const out = build + 'assets/css'; // ove mape nema, nas gulp bi ju trebao stvoriti 

    return gulp.src([ //ide source kao array, jer cemo ih mozda imati vise 
            
            'node_modules/bootstrap/scss/bootstrap.scss',
            //placeholder for bootstrap sass file
            
            src + 'sass/main.scss' 
            // tu cemo staviti samo jedan sass, ne moramo koristiti wildcards
        ])
        .pipe(sass().on('error', sass.logError))  // IMA PUNO KOMBINACIJA KOJE MU JO SMOZEMO ZADATI, NA PRIMJER DA GA TAKODJER MINIMIZIRA , sto bi bilo korisno
        .pipe(concat('bundle.css')) // on ce prvo kompajlirati sve css fajlove gore, pa ce ih konkatenirati u jedan bundle ! ZA OVO SMO MORALI SKINUTI gulp-concat
        .pipe(gulp.dest(out)); // tu cemo mu zadati gdje da ispuca nas kompajlirani i konkatenirani bundle, a to je konstanta out 
}


////
//ovi svi zadatci gore html i css su buildali nase finalne fajlove 
// 
// ispod cemo korisitii build koji spaja sve zadatke u paralalu i pokrece ih skupa
//
function watch(done){  // kod watchera gledamo source file-ove i idemo u dubinu pomoci wildcards... te pokrecemo html i css funkcije... ONE SE POKRECU SAMO AKO SE DOGODI PROMJENA NA NJIMA 
    gulp.watch(src + 'html/**/*', html);
    gulp.watch(src + 'sass/**/*', css);
    done(); // ovo znaci da je watcher odradio sve sto treba...sluzi kao nekakav return
}

exports.html = html; // da bi gulp mogao prepoznati ove funkcije kao task moramo ih exportati.. tu pisemo exports.imetaska  =  imefunkcije
exports.css = css;
exports.watch = watch; // necemo tu exportati watch... vec cemo stvoriti build task , tako da paralelno pozove html i css, te nakon toga ce pozvati watch.... jer ne mozemo zvati watch ako nemam izbuildane fajlove !  !
// ovo gore moramo napraviti da bi exportali zadatke 

exports.build = gulp.parallel(exports.html, exports.css);  // tu paralelno pozivamo dva taska s build metodom, ,,,, mozemo ih zvati i serijski 
//tu ccemo uz build staviti sve zadatke u jedan !

exports.default = gulp.series(exports.build, exports.watch);
// tu smo dodali default zadatak za gulp, pokrenemo ga samo sa rijeci gulp. nez dodatnog zadatka iza toga... tu smo u default dodali build zadatak i watch zadatak.... da ih pokrece u seriji jedan iza drugoga ...prvo build, da ga builda i onda nakon toga da prati promjene....