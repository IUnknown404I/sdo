export const EmailVerificationTemplate = (props: {
	email: string;
	datetime: string;
	verificationLink: string;
}): string => {
	return `<div style="width:100%;font-family:Montserrat,sans-serif;padding:0;Margin:0">
            <div style="background-color:#ffffff">
                <table width="100%" cellSpacing="0" cellPadding="0"
                       style="border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#ffffff">
                    <tbody>
                    <tr>
                        <td valign="top" style="padding:0;Margin:0">
                            <table cellPadding="0" cellSpacing="0" align="center"
                                   style="border-collapse:collapse;border-spacing:0px;table-layout:fixed!important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
                                   <table cellPadding="0" cellSpacing="0" align="center"
                                   style="border-collapse:collapse;border-spacing:0px;table-layout:fixed!important;width:100%">
                                <tbody>
                                <tr>
                                    <td align="center" style="padding:0;Margin:0">
                                        <table bgcolor="#ffffff" align="center" cellPadding="0" cellSpacing="0"
                                               style="border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:700px">
                                            <tbody>
                                            <tr>
                                                <td align="left"
                                                    style="Margin:0;padding-bottom:20px;padding-left:20px;padding-right:20px;padding-top:30px">
                                                    <table cellPadding="0" cellSpacing="0" width="100%"
                                                           style="border-collapse:collapse;border-spacing:0px">
                                                        <tbody>
                                                        <tr>
                                                            <td align="center" valign="top"
                                                                style="padding:0;Margin:0;width:660px">
                                                                <table cellPadding="0" cellSpacing="0" width="100%"
                                                                       role="presentation"
                                                                       style="border-collapse:collapse;border-spacing:0px">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td align="center"
                                                                            style="padding:0;Margin:0;font-size:0px">
                                                                            <img
                                                                                src="https://sdo.rnprog.ru/static/email-verification-image"
                                                                                alt="Emailing"
                                                                                style="display:block;border:0;outline:none;text-decoration:none"
                                                                                width="100" className="CToWUd"
                                                                                data-bit="iit"></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="center" style="padding:0;Margin:0">
                                                                            <h2 style="Margin:0;line-height:31px;font-family:Montserrat,sans-serif;font-size:26px;font-style:normal;font-weight:normal;color:#333333">Подтвердите
                                                                                Вашу почту для завершения
                                                                                регистрации</h2></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="center"
                                                                            style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;font-size:0">
                                                                            <table border="0" width="40%" height="100%"
                                                                                   cellPadding="0" cellSpacing="0"
                                                                                   style="border-collapse:collapse;border-spacing:0px;width:40%!important;display:inline-table"
                                                                                   role="presentation">
                                                                                <tbody>
                                                                                <tr>
                                                                                    <td style="padding:0;Margin:0;border-bottom:1px solid #cccccc;background:none;height:1px;width:100%;margin:0px"></td>
                                                                                </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="center" style="padding:5px;Margin:0">
                                                                            <p style="Margin:0;font-family:Montserrat,sans-serif;line-height:19px;color:#333333;font-size:16px">Благодарим
                                                                                за выбор нашего научно-образовательного центра!</p><p
                                                                            style="Margin:0;font-family:Montserrat,sans-serif;line-height:19px;color:#333333;font-size:16px">
                                                                            <br></p>
                                                                            <p style="Margin:0;font-family:Montserrat,sans-serif;line-height:19px;color:#333333;font-size:16px">Подтвердите,
                                                                                что в ${props.datetime} по
                                                                                МСК&nbsp;на&nbsp;данную&nbsp;электронную&nbsp;
                                                                                <br>почту&nbsp;<em><strong><a title="Написать письмо"
                                                                                    href="mailto:${props.email}"
                                                                                    style="text-decoration:none;color:#134f5c;font-size:16px"
                                                                                    target="_blank">${props.email}
                                                                                </a></strong></em>&nbsp;Вами была
                                                                                    зарегистрирована&nbsp;учётная<br>запись
                                                                                        на <em><strong><a title="Перейти к СДО"
                                                                                            href="https://sdo.rnprog.ru"
                                                                                            style="text-decoration:none;color:#134f5c;font-size:16px"
                                                                                            target="_blank">нашей
                                                                                            образовательной
                                                                                            платформе</a></strong></em>.&nbsp;
                                                                                        <br><br>Для этого нажмите на
                                                                                            кнопку подтверждения или
                                                                                            перейдите по ссылке:&nbsp;
                                                                                            <br><u><a title="Активировать почту"
                                                                                                href="https://api.sdo.rnprog.ru/users/validate/${props.verificationLink}?source=validation"
                                                                                                style="text-decoration:none;color:#134f5c;font-size:16px;word-break:break-all"
                                                                                                target="_blank">https://api.sdo.rnprog.ru/users/validate/<wbr>${props.verificationLink}?source=validation
                                                                                            </a></u><br>в течении <strong>72 часов</strong>.</p>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="center"
                                                                            style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;font-size:0">
                                                                            <table border="0" width="40%" height="100%"
                                                                                   cellPadding="0" cellSpacing="0"
                                                                                   style="border-collapse:collapse;border-spacing:0px;width:40%!important;display:inline-table"
                                                                                   role="presentation">
                                                                                <tbody>
                                                                                <tr>
                                                                                    <td style="padding:0;Margin:0;border-bottom:1px solid #cccccc;background:none;height:1px;width:100%;margin:0px"></td>
                                                                                </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="center"
                                                                            style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px">
                                                                            <span
                                                                                style="border-style:solid;border-color:#999999;background:#ffffff;border-width:1px;display:inline-block;border-radius:0px;width:auto"><a title="Подтвердить почту"
                                                                                href="https://api.sdo.rnprog.ru/users/validate/${props.verificationLink}?source=validation"
                                                                                style="text-decoration:none;color:#666666;font-size:16px;border-style:solid;border-color:#ffffff;border-width:10px 30px 10px 30px;display:inline-block;background:#ffffff;border-radius:0px;font-family:Montserrat,sans-serif;font-weight:normal;font-style:normal;line-height:19px;width:auto;text-align:center"
                                                                                target="_blank">Подтвердить мою почту</a></span>
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <table cellPadding="0" cellSpacing="0" align="center"
                                   style="border-collapse:collapse;border-spacing:0px;table-layout:fixed!important;width:100%">
                                <tbody>
                                <tr>
                                    <td align="center" style="padding:0;Margin:0">
                                        <table bgcolor="#ffffff" align="center" cellPadding="0" cellSpacing="0"
                                               style="border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:700px">
                                            <tbody>
                                            <tr>
                                                <td align="left"
                                                    style="padding:0;Margin:0;padding-left:20px;padding-right:20px;padding-top:40px">
                                                    <table cellPadding="0" cellSpacing="0" width="100%"
                                                           style="border-collapse:collapse;border-spacing:0px">
                                                        <tbody>
                                                        <tr>
                                                            <td align="center" valign="top"
                                                                style="padding:0;Margin:0;width:660px">
                                                                <table cellPadding="0" cellSpacing="0" width="100%"
                                                                       role="presentation"
                                                                       style="border-collapse:collapse;border-spacing:0px">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td align="center" style="padding:0;Margin:0">
                                                                            <h2 style="Margin:0;line-height:43px;font-family:Montserrat,sans-serif;font-size:36px;font-style:normal;font-weight:normal;color:#333333">Нужна
                                                                                помощь?</h2></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="center"
                                                                            style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;font-size:0">
                                                                            <table border="0" width="40%" height="100%"
                                                                                   cellPadding="0" cellSpacing="0"
                                                                                   style="border-collapse:collapse;border-spacing:0px;width:40%!important;display:inline-table"
                                                                                   role="presentation">
                                                                                <tbody>
                                                                                <tr>
                                                                                    <td style="padding:0;Margin:0;border-bottom:1px solid #cccccc;background:none;height:1px;width:100%;margin:0px"></td>
                                                                                </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="left"
                                                    style="padding:0;Margin:0;padding-bottom:20px;padding-left:20px;padding-right:20px">
                                                    <table cellPadding="0" cellSpacing="0" align="left"
                                                           style="border-collapse:collapse;border-spacing:0px;float:left">
                                                        <tbody>
                                                        <tr>
                                                            <td align="left" style="padding:0;Margin:0;width:310px">
                                                                <table cellPadding="0" cellSpacing="0" width="100%"
                                                                       role="presentation"
                                                                       style="border-collapse:collapse;border-spacing:0px">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td align="center"
                                                                            style="padding:0;Margin:0;padding-bottom:5px;padding-top:10px">
                                                                            <h3 style="Margin:0;line-height:24px;font-family:Montserrat,sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#333333">Напишите
                                                                                нам</h3></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="center"
                                                                            style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px">
                                                                            <span
                                                                                style="border-style:solid;border-color:#999999;background:#ffffff;border-width:1px;display:block;border-radius:0px;width:auto"><a title="Написать письмо"
                                                                                href="mailto:u2610272@mrgeng.ru?subject=%5B%D0%9D%D1%83%D0%B6%D0%BD%D0%B0%20%D0%BF%D0%BE%D0%BC%D0%BE%D1%89%D1%8C%5D"
                                                                                style="text-decoration:none;color:#666666;font-size:16px;border-style:solid;border-color:#ffffff;border-width:10px 30px 10px 30px;display:block;background:#ffffff;border-radius:0px;font-family:Montserrat,sans-serif;font-weight:normal;font-style:normal;line-height:19px;width:auto;text-align:center;border-left-width:30px;border-right-width:30px"
                                                                                target="_blank">u2610272@mrgeng.ru</a></span>
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                    <table cellPadding="0" cellSpacing="0" align="right"
                                                           style="border-collapse:collapse;border-spacing:0px;float:right">
                                                        <tbody>
                                                        <tr>
                                                            <td align="left" style="padding:0;Margin:0;width:310px">
                                                                <table cellPadding="0" cellSpacing="0" width="100%"
                                                                       role="presentation"
                                                                       style="border-collapse:collapse;border-spacing:0px">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td align="center"
                                                                            style="padding:0;Margin:0;padding-bottom:5px;padding-top:10px">
                                                                            <h3 style="Margin:0;line-height:24px;font-family:Montserrat,sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#333333">Посмотрите
                                                                                наш раздел FAQ</h3></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="center"
                                                                            style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px">
                                                                            <span
                                                                                style="border-style:solid;border-color:#999999;background:#ffffff;border-width:1px;display:block;border-radius:0px;width:auto"><a title="Перейти к вопросам"
                                                                                href="https://umcmrg.ru/faq"
                                                                                style="text-decoration:none;color:#666666;font-size:16px;border-style:solid;border-color:#ffffff;border-width:10px 30px;display:block;background:#ffffff;border-radius:0px;font-family:Montserrat,sans-serif;font-weight:normal;font-style:normal;line-height:19px;width:auto;text-align:center"
                                                                                target="_blank">Часто задаваемые вопросы</a></span>
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <table cellPadding="0" cellSpacing="0" align="center"
                                   style="border-collapse:collapse;border-spacing:0px;table-layout:fixed!important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
                                <tbody>
                                <tr>
                                    <td align="center" style="padding:0;Margin:0">
                                        <table bgcolor="#ffffff" align="center" cellPadding="0" cellSpacing="0"
                                               style="border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:700px">
                                            <tbody>
                                            <tr>
                                                <td align="left"
                                                    style="padding:0;Margin:0;padding-left:20px;padding-right:20px">
                                                    <table cellPadding="0" cellSpacing="0" width="100%"
                                                           style="border-collapse:collapse;border-spacing:0px">
                                                        <tbody>
                                                        <tr>
                                                            <td align="left" style="padding:0;Margin:0;width:660px">
                                                                <table cellPadding="0" cellSpacing="0" width="100%"
                                                                       role="presentation"
                                                                       style="border-collapse:collapse;border-spacing:0px">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td align="center"
                                                                            style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;font-size:0">
                                                                            <table border="0" width="100%" height="100%"
                                                                                   cellPadding="0" cellSpacing="0"
                                                                                   role="presentation"
                                                                                   style="border-collapse:collapse;border-spacing:0px">
                                                                                <tbody>
                                                                                <tr>
                                                                                    <td style="padding:0;Margin:0;border-bottom:1px solid #cccccc;background:none;height:1px;width:100%;margin:0px"></td>
                                                                                </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="left" style="padding:20px;Margin:0">
                                                    <table cellPadding="0" cellSpacing="0" width="100%"
                                                           style="border-collapse:collapse;border-spacing:0px">
                                                        <tbody>
                                                        <tr>
                                                            <td align="center" valign="top"
                                                                style="padding:0;Margin:0;width:660px">
                                                                <table cellPadding="0" cellSpacing="0" width="100%"
                                                                       role="presentation"
                                                                       style="border-collapse:collapse;border-spacing:0px">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td align="center" style="padding:0;Margin:0"><p
                                                                            style="Margin:0;font-family:Montserrat,sans-serif;line-height:18px;color:#333333;font-size:12px">Вы
                                                                            получили это электронное письмо, потому что
                                                                            посетили один из наших сайтов или направили
                                                                            запрос на взаимодействие. Продолжая
                                                                            пользоваться нашими услугами и
                                                                            веб-сайтами, <br>Вы соглашаетесь с&nbsp;<a title="Перейти к документу"
                                                                                href="https://umcmrg.ru/documents/%D0%9F%D0%BE%D0%BB%D0%B8%D1%82%D0%B8%D0%BA%D0%B0%20%D0%BE%D0%B1%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B8%20%D0%BF%D0%B5%D1%80%D1%81%D0%BE%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D1%85%20%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85.pdf"
                                                                                style="text-decoration:underline;color:#134f5c;font-size:12px"
                                                                                target="_blank">Политикой
                                                                                обработки персональных данных</a>.</p>
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <table cellPadding="0" cellSpacing="0" align="center"
                                   style="border-collapse:collapse;border-spacing:0px;table-layout:fixed!important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
                                <tbody>
                                <tr>
                                    <td align="center" style="padding:0;Margin:0">
                                        <table bgcolor="#ffffff" align="center" cellPadding="0" cellSpacing="0"
                                               style="border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:700px">
                                            <tbody>
                                            <tr>
                                                <td align="left"
                                                    style="padding:0;Margin:0;padding-bottom:10px;padding-left:20px;padding-right:20px">
                                                    <table cellPadding="0" cellSpacing="0" width="100%"
                                                           style="border-collapse:collapse;border-spacing:0px">
                                                        <tbody>
                                                        <tr>
                                                            <td valign="top" align="center"
                                                                style="padding:0;Margin:0;width:660px">
                                                                <table cellPadding="0" cellSpacing="0" width="100%"
                                                                       role="presentation"
                                                                       style="border-collapse:collapse;border-spacing:0px">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td align="center"
                                                                            style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;font-size:0">
                                                                            <table border="0" width="100%" height="100%"
                                                                                   cellPadding="0" cellSpacing="0"
                                                                                   role="presentation"
                                                                                   style="border-collapse:collapse;border-spacing:0px">
                                                                                <tbody>
                                                                                <tr>
                                                                                    <td style="padding:0;Margin:0;border-bottom:1px solid #cccccc;background:none;height:1px;width:100%;margin:0px"></td>
                                                                                </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="padding:0;Margin:0">
                                                                            <table cellPadding="0" cellSpacing="0"
                                                                                   width="100%" role="presentation"
                                                                                   style="border-collapse:collapse;border-spacing:0px">
                                                                                <tbody>
                                                                                <tr>
                                                                                    <td align="center" valign="top"
                                                                                        width="25%"
                                                                                        id="m_-4198083305471399370m_-6818085964397826551esd-menu-id-0"
                                                                                        style="Margin:0;padding-left:5px;padding-right:5px;padding-top:10px;padding-bottom:10px;border:0">
                                                                                        <a href="https://umcmrg.ru/study-programs" title="Перейти"
                                                                                           style="text-decoration:none;display:block;font-family:arial,'helvetica neue',helvetica,sans-serif;color:#333333;font-size:14px"
                                                                                           target="_blank">КУРСЫ</a>
                                                                                    </td>
                                                                                    <td align="center" valign="top"
                                                                                        width="25%"
                                                                                        id="m_-4198083305471399370m_-6818085964397826551esd-menu-id-1"
                                                                                        style="Margin:0;padding-left:5px;padding-right:5px;padding-top:10px;padding-bottom:10px;border:0">
                                                                                        <a href="https://umcmrg.ru/contacts" title="Перейти"
                                                                                           style="text-decoration:none;display:block;font-family:arial,'helvetica neue',helvetica,sans-serif;color:#333333;font-size:14px"
                                                                                           target="_blank">КОНТАКТЫ</a>
                                                                                    </td>
                                                                                    <td align="center" valign="top"
                                                                                        width="25%"
                                                                                        id="m_-4198083305471399370m_-6818085964397826551esd-menu-id-2"
                                                                                        style="Margin:0;padding-left:5px;padding-right:5px;padding-top:10px;padding-bottom:10px;border:0">
                                                                                        <a href="https://umcmrg.ru/blog" title="Перейти"
                                                                                           style="text-decoration:none;display:block;font-family:arial,'helvetica neue',helvetica,sans-serif;color:#333333;font-size:14px"
                                                                                           target="_blank">БЛОГ</a>
                                                                                    </td>
                                                                                    <td align="center" valign="top"
                                                                                        width="25%"
                                                                                        id="m_-4198083305471399370m_-6818085964397826551esd-menu-id-2"
                                                                                        style="Margin:0;padding-left:5px;padding-right:5px;padding-top:10px;padding-bottom:10px;border:0">
                                                                                        <a href="https://sdo.umcmrg.ru" title="Перейти"
                                                                                           style="text-decoration:none;display:block;font-family:arial,'helvetica neue',helvetica,sans-serif;color:#333333;font-size:14px"
                                                                                           target="_blank">ЛИЧНЫЙ КАБИНЕТ</a></td>
                                                                                </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="center"
                                                                            style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;font-size:0">
                                                                            <table border="0" width="100%" height="100%"
                                                                                   cellPadding="0" cellSpacing="0"
                                                                                   role="presentation"
                                                                                   style="border-collapse:collapse;border-spacing:0px">
                                                                                <tbody>
                                                                                <tr>
                                                                                    <td style="padding:0;Margin:0;border-bottom:1px solid #cccccc;background:none;height:1px;width:100%;margin:0px"></td>
                                                                                </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div className="yj6qo"></div>
                <div className="adL">
                </div>
            </div>
            <div className="adL">
            </div>
        </div>`;
};

export default EmailVerificationTemplate;
