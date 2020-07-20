resource "aws_dynamodb_table" "users" {
  name = var.users_table_name

  hash_key = "userId"

  attribute {
    name = "userId"
    type = "S"
  }

  billing_mode = "PAY_PER_REQUEST"
}

resource "aws_ssm_parameter" "users_table_name" {
  name  = "/spotify-release-tracker/${var.environment}/dynamo/users/name"
  type  = "String"
  value = aws_dynamodb_table.users.id
}

resource "aws_ssm_parameter" "users_table_arn" {
  name  = "/spotify-release-tracker/${var.environment}/dynamo/users/arn"
  type  = "String"
  value = aws_dynamodb_table.users.arn
}
