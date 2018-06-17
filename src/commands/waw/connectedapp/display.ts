import {core, SfdxCommand, flags} from '@salesforce/command';

export default class Display extends SfdxCommand {

  public static description = 'Display the details of a connected app in your org';

  protected static flagsConfig = {
    connectedappname: flags.string(
      {
        char: 'n', 
        description: 'connected app name',
      })
  };

  // sfdx options
  protected static requiresUsername = true;
  protected static supportsDevhubUsername = false;
  protected static requiresProject = false;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    
    const connectedAppName = this.flags.connectedappname;

    this.org.getConnection().metadata.read('ConnectedApp', connectedAppName, (readErr, metadataResult) => {
      if (readErr) {
        this.ux.error(readErr);
        return;
      }
      this.ux.logJson(metadataResult);
    });
  }
}
