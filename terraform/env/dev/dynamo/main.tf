module "dynamo_tables" {
  source = "../../../modules/dynamo"

  environment      = "dev"
  users_table_name = "spotify-release-tracker-users-dev"
}
