/*
** Class: CmpSignatureCaptureCtrlTest
** Created by OpFocus (Veena Sundara-Heragu) on 2/21/19
** Description: Test class for CmpSignatureCaptureCtrl
*/
@isTest
public class CmpSignatureCaptureCtrlTest
{

    @testSetup static void buildData()
    {
    }

    //test methods

    static testMethod void myTest1()
    {
        Account a = new Account(Name = 'test');
        insert a;

        String fileName = 'Test.png';
        String base64Data = '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';

        CmpSignatureCaptureCtrl.ctrlCreateFile(fileName, base64Data, a.Id);

        // check results
        ContentDocumentLink[] lstLink = [Select Id, ContentDocumentId, ContentDocument.Title from ContentDocumentLink Where LinkedEntityId = :a.Id];
        system.assertEquals(1, lstLink.size());
        system.assertEquals('Test.png', lstLink[0].ContentDocument.Title);

        List<String> lstData = CmpSignatureCaptureCtrl.ctrlGetFile('Test.png');
        system.assertNotEquals(null, lstData);

        lstData = CmpSignatureCaptureCtrl.ctrlGetFile(lstLink[0].ContentDocumentId);
        system.assertNotEquals(null, lstData);
    }

}