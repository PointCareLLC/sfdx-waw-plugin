import { SfdxCommand, flags } from '@salesforce/command';
import request = require('request');

export default class Share extends SfdxCommand {

  public static description = 'share a scratch org with someone via email';

  public static examples = [
    `sfdx waw:org:share
    `
  ];

  protected static flagsConfig = {
    emailaddress: flags.string(
      {
        char: 'e',
        description: 'email address of the scratch org recipient',
        required: true
      })
  };

  // sfdx options
  protected static requiresUsername = true;
  protected static supportsDevhubUsername = true;
  protected static requiresProject = false;

  public async run(): Promise<any> { // tslint:disable-line:no-any

    const emailAddress = this.flags.emailaddress;
    const conn = this.org.getConnection();
    const targetUsername = conn.getUsername();
    const accessToken = conn.accessToken;
    const instanceUrl = conn.instanceUrl;
    const frontDoorUrlForOrg = instanceUrl + "/secur/frontdoor.jsp?sid=" + accessToken;
    const connHubOrg = this.hubOrg.getConnection();
    const accessTokenHubOrg = connHubOrg.accessToken;
    const instanceUrlHubOrg = connHubOrg.instanceUrl;
    const devHubUsername = connHubOrg.getUsername();

    const jsonBody =
      `{ "inputs" :
        [{
          "emailBody" : "${devHubUsername} has shared a Salesforce org with you. Here's your login URL: ${frontDoorUrlForOrg}. Keep this URL confidential and do not share with others.",
          "emailAddresses" : "${emailAddress}",
          "emailSubject" : "${devHubUsername} shared an org with you",
          "senderType" : "CurrentUser"
        }]
      }`;

    const options = {
      method: 'post',
      body: JSON.parse(jsonBody),
      json: true,
      url: `${instanceUrlHubOrg}/services/data/v36.0/actions/standard/emailSimple`,
      headers: {
        Authorization: `Bearer ${accessTokenHubOrg}`,
        'Content-Type': 'application/json'
      }
    };

    request(options, (err, res, body) => {
      if (err) {
        this.ux.error(err);
        return;
      }

      if (body[0].isSuccess) {
        this.ux.log(`Successfully shared ${targetUsername} with ${emailAddress} from ${devHubUsername}.`);
      } else {
        this.ux.error(body);
      }
    });
  }
}
