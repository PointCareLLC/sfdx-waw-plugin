import { core, SfdxCommand } from "@salesforce/command";

export default class List extends SfdxCommand {
  public static description = "list org credentials";

  public static examples = [
    `sfdx waw:org:list
    `
  ];

  // sfdx options
  protected static requiresUsername = true;
  protected static supportsDevhubUsername = true;
  protected static requiresProject = false;

  async run() {
    const usernames = await core.AuthInfo.listAllAuthFiles();
    const aliases = await core.Aliases.retrieve();
    const entries = await aliases.entries();

    this.ux.log(entries);
    // return

    // let output : string[]

    // for (let username of usernames) {
    //   username = username.replace('.json', '')

    //   let alias : string = aliases.getKeysByValue(username)[0]

    //   // this.ux.log(`${username} ${alias}`)
    //   // let row : string[]
    //   // row.push(username)
    //   // row.push(alias)
    //   // output.push(row.toString())
    // }

    // this.ux.table(output)

    return null;
  }
}
