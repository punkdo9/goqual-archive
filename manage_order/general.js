var ref = get_Ref();

//스프레드시트 열릴시
function Init() {
    //ui 생성
    SpreadsheetApp.getUi()
    .createMenu('출고관리')
    .addItem('주문취합', 'fetch_Order_button')
    .addItem('주문제출', 'submit_Order_button')
    .addItem('출고지시', 'download_Order')
    .addSeparator()
    .addItem('송장입력', 'fetch_Invcoie_button')
    .addItem('송장추출', 'push_Invoice_button')
    .addItem('송장전달', 'send_Invoice_button')
    .addToUi();

    add_Trigger();
}

async function fetch_Order_button() {
    await check_Upload();
}

async function submit_Order_button() {
    await fetch_Additional_info();
    await submit_Order();
}

async function fetch_Invcoie_button() {
    await check_Upload()
}

async function push_Invoice_button() {
    await push_Invoice();
}

async function send_Invoice_button() {
    await send_Invoice();
}

async function delete_Archive() {
    let key = ['다운로드/아카이브', '업로드/아카이브'];
    key.forEach((k) => {
        let folder = DriveApp.getFolderById(ref.get(k));
        let files = folder.getFiles();

        while(files.hasNext()) {
            let file = files.next();
            Drive.Files.remove(file.getId());
        }
    })
}

async function add_Trigger() {
    let triggers = ScriptApp.getProjectTriggers().filter((x) => x.getHandlerFunction() == 'check_Upload');

    if (triggers.length == 0) {
        ScriptApp.newTrigger('check_Upload')
        .timeBased()
        .everyMinutes(5)
        .create();

        ScriptApp.newTrigger('remove_Trigger')
        .timeBased()
        .everyDays()
        .nearMinute()
    }
}

async function remove_Trigger() {
    let triggers = ScriptApp.getProjectTriggers().filter((x) => x.getHandlerFunction() == 'check_Upload');

    triggers.forEach((t) => {
        ScriptApp.deleteTrigger(t);
    });
}