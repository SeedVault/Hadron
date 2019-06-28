/*jshint esversion: 6 */

/*
These files are made available to you on an as-is and restricted basis, and may only be redistributed or sold to any third party as expressly indicated in the Terms of Use for Seed Vault.
Seed Vault Code (c) Botanic Technologies, Inc. Used under license.
*/

const Config = {
  also_known_as                  : `${Configalso_known_as}`,
  all_your_bases_are_belong_to_us: `${Configall_your_bases_are_belong_to_us}`,
  bbot_base_uri                  : `${Configbbot_base_uri}`,
  author_tool_domain             : `${Configauthor_tool_domain}`,
  bbot_id                        : `${Configbbot_id}`
};

var inActr;

export class HadronActr {
  constructor(self, options) {
    options = typeof(options) !== "undefined" ? options : {};

		this.name = self;
  }
}
