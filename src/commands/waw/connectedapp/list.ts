import {SfdxCommand} from '@salesforce/command';

export default class List extends SfdxCommand {

  public static description = 'List the connected apps in your org';

  // sfdx options
  protected static requiresUsername = true;
  protected static supportsDevhubUsername = false;
  protected static requiresProject = false;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    
    var types = [{type: 'ConnectedApp', folder: null}];
    this.org.getConnection().metadata.list(types, '42.0', (readErr, metadataResult) => {
      if (readErr) {
        this.ux.error(readErr);
        return;
      }
      this.ux.logJson(metadataResult);
    });
  }
}
