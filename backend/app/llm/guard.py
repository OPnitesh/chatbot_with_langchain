# app/llm/guard.py

AWS_TERMS = [
    "aws",
    "ec2", "s3", "iam", "vpc", "lambda", "rds",
    "cloudwatch", "cloudtrail",
    "api gateway", "nat gateway", "internet gateway",
    "alb", "elb",
    "autoscaling", "eks", "ecs",
    "route53", "dynamodb", "sns", "sqs",
    "kms", "cloudformation", "well-architected"
]

BLOCK_MESSAGE = (
    "I specialize in AWS-related questions only. "
    "Please ask something about AWS services or architecture."
)


def is_aws_related(message: str) -> bool:
    """
    Check if message is AWS-related
    """
    msg = message.lower()
    return any(term in msg for term in AWS_TERMS)


def enforce_aws_only(user_message: str, ai_response: str) -> str:
    """
    Final security layer:
    1. Block if user question is not AWS-related
    2. Block if AI response does not contain AWS context
    """

    # Check user intent
    if not is_aws_related(user_message):
        return BLOCK_MESSAGE

    # Check AI response safety
    if not is_aws_related(ai_response):
        return BLOCK_MESSAGE

    return ai_response
