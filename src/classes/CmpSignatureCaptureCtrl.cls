/* Class:       CmpSignatureCaptureCtrl
** Created by:  OpFocus (Veena Sundara-Heragu) on 2/20/19
** Description: Controller for CmpSignatureCapture Lightning Component
*/
public with sharing class CmpSignatureCaptureCtrl
{
    /**
     * Creates a salesforce file and returns the ContentDocument.Id
     * @param fileName
     * @param base64Data - base 64 encoded data to be stored
     * @param recordId - optional - if the file needs to be linked to some entity
     * @return ContentDocument.Id
     */
    @AuraEnabled
    public static Id ctrlCreateFile( String fileName, String base64Data, String recordId )
    {
        try
        {
            //base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');

            ContentVersion cv = new ContentVersion();
            cv.ContentLocation = 'S';
            cv.VersionData = EncodingUtil.base64Decode(base64Data);
            cv.Title = fileName;
            cv.PathOnClient = filename;

            insert cv;

            ContentDocumentLink cdl = new ContentDocumentLink();
            cdl.ContentDocumentId = [SELECT Id, ContentDocumentId FROM ContentVersion WHERE Id =: cv.Id].ContentDocumentId;

            if(recordId != null && !String.isEmpty(recordId))
            {
                cdl.LinkedEntityId = recordId;
                cdl.ShareType = 'V';
                insert cdl;
            }

            return cdl.ContentDocumentId;
        }
        catch (Exception ex)
        {
            throw new AuraHandledException('Exception occured:\r\n' + ex.getMessage() + '\r\n' + ex.getStackTraceString() + '\r\n');
        }
    }


    /**
     * Retrieves the salesforce file using either file name or ContentDocument Id and returns file data in a format
     * that can be loaded into the signature component
     * @param fileName
     * @return
     */
    @AuraEnabled
    public static List<String> ctrlGetFile( String fileName )
    {
        try
        {
            ContentVersion[] lstCV;
            //check if it is a file name or a ContentDocumentId
            if(fileName instanceOf Id)
            {
                lstCV = [SELECT Id, VersionData FROM ContentVersion where ContentDocumentId = :fileName AND IsLatest = true limit 1];
            }
            else
            {
                lstCV = [SELECT Id, VersionData FROM ContentVersion where Title = :fileName AND IsLatest = true limit 1];
            }

            if(lstCV.isEmpty())
            {
                return null;
            }

            List<String> lstData = new List<String>();
            lstData.add('image/png;base64');
            lstData.add(EncodingUtil.base64Encode(lstCV[0].VersionData));
            return lstData;
        }
        catch (Exception ex)
        {
            throw new AuraHandledException('Exception occured:\r\n' + ex.getMessage() + '\r\n' + ex.getStackTraceString() + '\r\n');
        }
    }


}