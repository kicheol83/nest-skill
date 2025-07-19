import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { AuthModule } from './auth/auth.module';
import { ProviderModule } from './provider/provider.module';
import { NotificationModule } from './notification/notification.module';
import { OrderModule } from './order/order.module';
import { NoticeModule } from './notice/notice.module';
import { PaymentModule } from './payment/payment.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { FollowModule } from './follow/follow.module';
import { ViewModule } from './view/view.module';
import { BoardArticleModule } from './board-article/board-article.module';
import { OrderItemModule } from './order-item/order-item.module';
import { ReviewModule } from './review/review.module';

@Module({
	imports: [
		MemberModule,
		AuthModule,
		ProviderModule,
		NotificationModule,
		OrderModule,
		NoticeModule,
		PaymentModule,
		CommentModule,
		LikeModule,
		FollowModule,
		ViewModule,
		BoardArticleModule,
		OrderItemModule,
		ReviewModule,
	],
})
export class ComponentsModule {}
