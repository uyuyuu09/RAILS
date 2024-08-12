// Google Form 回答or未回答自動チェック&Gmailによる回答催促システム

// formの回答確認
function check() {
    const url = "https://docs.google.com/forms/d/e/1FAIpQLSdQ5UJRU7w_wN1iAVLKIuCC_amn3VZ-Gb7WCXXdhCg2frr3UA/viewform"; //チェックするFormのURL
    const sheet_id = "15CXJ7pGXnYAXFJr97AftVDHBLSFhXm6fIat6-6U-J80"; //スプレッドシートのID
    const sheet_name = "mem"; //スプレッドシートのシート名
    const range = "J2:K42"; //スプレッドシートの参照する範囲(メールアドレスなどがある範囲)
                            //最後の行が定まっていない場合は、getLastRow()を使うとシートの最後の行番号を動的に取得できる。
                            //例). ("A1:B" + sheet.getLastRow())

    //スプレッドシートをID参照で開き、シート名をもとに対象のシートから取得したい範囲を二次元配列で取得する
    const sheet = SpreadsheetApp.openById(sheet_id).getSheetByName(sheet_name).getRange(range).getValues();

    // 例). A列に「220109@oks.city-saitama.ed.jp」「220110@oks.city-saitama.ed.jp」「220111@oks.city-saitama.ed.jp」...というメールアドレス、B列にそのメールアドレスに対応する氏名(氏名1、氏名2、氏名3、...)があるとき
    // 出力結果: [['220109@oks.city-saitama.ed.jp', '氏名1'],
    //           ['220110@oks.city-saitama.ed.jp', '氏名2'],
    //           ['220111@oks.city-saitama.ed.jp', '氏名3'],
    //           ...
    //          ]
    //となる。
    //そもそも配列とは?
    // →複数のデータを順番に格納したもの。['data1', 'data2', 'data3', ....]のように角括弧で1つのまとまりを表している。上記の出力結果は、角括弧の中にさらに角括弧があるため、「対応するデータ」を持つ配列といえる(たぶん)。
    //勘が良ければもう気づいてるかもだけど、一番外側の角括弧の中にある、データを仕分けている角括弧の個数がn個のとき、それはn次元配列といえる(一次元配列は一番外側の角括弧とデータを仕分けている角括弧が同じ(1つ)、一般的に一次元配列は「配列」と略される)
    //上記の出力結果の配列は、一番外側の角括弧の中にもう一つ角括弧があり、その角括弧でデータを仕分けているので二次元配列！

    //「console.log(表示したいもの(文字列、数字))またはLogger.log(表示したいもの(文字列、数字))」で出力できる。
    console.log(sheet);

    //ここから下は各自調べてください。
    //-----------------------------------------------------------------------------------------------------------------

    const not_submit_person = [];
    let header = '<p><font size="4" style="font-family: sans-serif; color: #004a6e">RAILSより、Google Form回答状況についてお知らせします。</font></p>';
    let content = `<font size="3">あなたの回答が確認できませんでした。以下のURLより、早急に回答をしてください。</font><br />`;
    let footer = `<br>${url}<br><br><br><strong>Google Form自動管理ツール RAILS</strong><br><font size="2"><strong>CREATED BY <a href="https://github.com/uyuyuu09/">uyuyu.create</a></strong></font>`;
    for(let i = 0; i < sheet.length; i++) {
        if(sheet[i][1] !== "回答済み") { //ここの数字は取得範囲の一番左側の列を0列目として数えたもの
            not_submit_person.push(sheet[i][0]);
            let Draft = GmailApp.createDraft(sheet[i][0], "Google Form回答状況について", "body" , {
                name: "RAILS by uyuyu",
                htmlBody: (header + content + footer),
            });
            Draft.send()
        }
    }
    console.log(not_submit_person)
    return;
}
